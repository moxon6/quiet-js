source ~/dev/emsdk/emsdk_env.sh

cd libfec
emconfigure ./configure --prefix=${HOME}/opt
sed -i 's/ldconfig//g' makefile
make
make install