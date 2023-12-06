CXX = ccache g++
OUTPUT_FILE=bin/moon

define INCLUDE
	v8/include/
endef

define INCLUDEUV
	libuv/include/
endef

define SRC
	myOwnRuntime/index.cc
endef

define DEP
	v8/libv8_monolith.a
	libuv/libuv.a
endef

export INCLUDE
export INCLUDEUV
export OUTPUT_FILE

export SRC
export DEP

build:
	mkdir -p bin
	$(CXX) myOwnRuntime/index.cc -I $$INCLUDE -I $$INCLUDEUV -std=c++17 -pthread -o bin/michelJS $< -DV8_COMPRESS_POINTERS -DV8_ENABLE_SANDBOX $$DEP -Wl,--no-as-needed -ldl

run:
	./bin/michelJS ./test.js
