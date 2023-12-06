#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <libplatform/libplatform.h>
#include <uv.h>
#include "v8.h"

#include "./helpers/strings.hpp"
#include "./helpers/file-manager.hpp"
#include "./custom-functions/print.hpp"
#include "./custom-functions/timer.hpp"
#include "./my-own-runtime.hpp"

int main(int argc, char* argv[]) {
    char *jsFile = argv[1];

    auto *myOwnRuntime = new MyOwnRuntime();
    std::unique_ptr<v8::Platform> platform =
        myOwnRuntime->initV8(argc, argv);
    
    myOwnRuntime->initVM();
    myOwnRuntime->initRuntime(jsFile);
    myOwnRuntime->Shutdown();

    return 0;
}
