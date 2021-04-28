source ~/dev/emsdk/emsdk_env.sh

cd dependencies/quiet
mkdir -p build_js

git apply ../../tools/quiet.patch
cd build_js
emcmake cmake .. -DCMAKE_INSTALL_PREFIX:PATH=${HOME}/opt
make
make install