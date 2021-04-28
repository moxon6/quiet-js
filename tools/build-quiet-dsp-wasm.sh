source ~/dev/emsdk/emsdk_env.sh
cd dependencies/quiet-dsp

export EMCC_CFLAGS="-I${HOME}/opt/include -DLIBFEC_ENABLED=1"

aclocal
autoconf
autoheader
emconfigure ./configure --prefix=${HOME}/opt
sed -i 's/ldconfig//g' makefile
make
make install