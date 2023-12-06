
uv_loop_t *DEFAULT_LOOP = uv_default_loop();

class MyOwnRuntime {
    private:
        v8::Isolate *isolate;
        v8::Local<v8::Context> context;
        std::unique_ptr<v8::Platform> *platform;
        v8::Isolate::CreateParams create_params;

        void WaitForEvents() {
            uv_run(DEFAULT_LOOP, UV_RUN_DEFAULT);
        }

        void ExecuteScriptAndWaitForEvents(char *filename) {
            // Enter the context for compiling and running the hello world script.
            v8::Context::Scope context_scope(this->context);
            {
                v8::Local<v8::String> source;
                if (!FileManager::ReadFile(isolate, filename).ToLocal(&source)) {
                    fprintf(stderr, "Error reading file\n");
                    return;
                }

                // Create a string containing the JavaScript source code.
                v8::ScriptOrigin origin(isolate, v8_toStringUTF8(filename));

                // Compile the source code.
                v8::Local<v8::Script> script =
                    v8::Script::Compile(this->context, source, &origin).ToLocalChecked();

                // Run the script to get the result.
                v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

                // Convert the result to an UTF8 string and print it.
                v8::String::Utf8Value utf8(isolate, result);

                WaitForEvents();
            }
        }

    public:
        std::unique_ptr<v8::Platform> initV8(int argc, char *argv[]) {
            v8::V8::InitializeICUDefaultLocation(argv[0]);
            v8::V8::InitializeExternalStartupData(argv[0]);
            
            std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
            v8::V8::InitializePlatform(platform.get());
            v8::V8::Initialize();

            this->platform = &platform;
            return platform;
        }

        void initVM() {
            // Create a new Isolate and make it the current one.
            v8::Isolate::CreateParams create_params;
            create_params.array_buffer_allocator =
                v8::ArrayBuffer::Allocator::NewDefaultAllocator();
            
            this->isolate = v8::Isolate::New(create_params);
            this->create_params = create_params;
        }

        void initRuntime(char *filename) {
            v8::Isolate::Scope isolate_scope(this->isolate);
            
            // Create a stack-allocated handle scope.
            v8::HandleScope handle_scope(this->isolate);

            // Create a template for the global object.
            v8::Local<v8::ObjectTemplate> global = v8::ObjectTemplate::New(this->isolate);

            Timer timer;
            timer.Init(DEFAULT_LOOP);

            // Bind my custom functions
            global->Set(isolate, "mPrint", v8::FunctionTemplate::New(isolate, MPrint));
            global->Set(isolate, "mTimeout", v8::FunctionTemplate::New(isolate, timer.Timeout));

            // Create a new context.
            this->context = v8::Context::New(this->isolate, NULL, global);
            
            ExecuteScriptAndWaitForEvents(filename);
        }

        void Shutdown() {
            this->isolate->Dispose();
            v8::V8::Dispose();
            v8::V8::DisposePlatform();
            delete this->create_params.array_buffer_allocator;
        }
};