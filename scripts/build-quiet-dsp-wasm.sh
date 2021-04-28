source ~/dev/emsdk/emsdk_env.sh
cd dependencies/quiet-dsp

export EMCC_CFLAGS="-I${HOME}/opt/include -DLIBFEC_ENABLED=1"

emconfigure ./configure --prefix=${HOME}/opt
make
make install