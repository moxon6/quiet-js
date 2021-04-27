source ~/dev/emsdk/emsdk_env.sh

cd jansson-2.13
emconfigure ./configure --prefix=${HOME}/opt

make
make install