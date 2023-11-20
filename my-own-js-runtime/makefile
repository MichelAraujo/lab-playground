CXX = ccache g++
OUTPUT_FILE=bin/moon

define INCLUDEV8
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

export INCLUDEV8
export INCLUDEUV
export OUTPUT_FILE

export SRC
export DEP

build:
	mkdir -p bin
	$(CXX) myOwnRuntime/uv-timers.cpp -I $$INCLUDEV8 -I $$INCLUDEUV -std=c++17 -pthread -o bin/$@ $< -DV8_COMPRESS_POINTERS $$DEP -Wl,--no-as-needed -ldl
