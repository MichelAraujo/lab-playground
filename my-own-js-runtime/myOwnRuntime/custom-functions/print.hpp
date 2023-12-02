void MPrint(const v8::FunctionCallbackInfo<v8::Value> &args) {
  for (int i = 0; i < args.Length(); i++) {
    v8::HandleScope handle_scope(args.GetIsolate());
    v8::String::Utf8Value str(args.GetIsolate(), args[i]);

    printf("%s", *str);
  }

  printf("\n");
  fflush(stdout);
}