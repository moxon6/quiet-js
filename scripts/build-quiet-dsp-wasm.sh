source ~/dev/emsdk/emsdk_env.sh
cd quiet-dsp

export EMCC_CFLAGS="-I/home/martin/opt/include -DLIBFEC_ENABLED=1"

emconfigure ./configure --prefix=${HOME}/opt
make
make install