
uv_loop_t *loop;

struct timer {
    uv_timer_t uvTimer;
};

class Timer {
    public:
        static void Init(uv_loop_t *evloop) {
            loop = evloop;
        }

        static void Timeout(const v8::FunctionCallbackInfo<v8::Value> &args) {
            auto isolate = args.GetIsolate();
            auto context = isolate->GetCurrentContext();
            int64_t sleep = args[0]->IntegerValue(context).ToChecked();
            int64_t interval = args[1]->IntegerValue(context).ToChecked();

            v8::Local<v8::Value> callback = args[2];
            if (!callback->IsFunction()) {
                printf("Callback not declared!");
                return;
            }

            timer *timerWrap = new timer();
            timerWrap->uvTimer.data = (void *)timerWrap;
            
            uv_timer_init(loop, &timerWrap->uvTimer);
            uv_timer_start(&timerWrap->uvTimer, onTimerCallback, sleep, interval);
        }

        static void onTimerCallback(uv_timer_t *handle) {
            printf("## OnTimer ## \n");
        }
};