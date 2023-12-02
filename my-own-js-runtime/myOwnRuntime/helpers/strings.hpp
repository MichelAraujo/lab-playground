static inline v8::Local<v8::String> v8_toStringUTF8(const char *x)
{
    return v8::String::NewFromUtf8(v8::Isolate::GetCurrent(), x).ToLocalChecked();
}