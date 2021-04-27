source ~/dev/emsdk/emsdk_env.sh

cd quiet

script_path=`dirname $BASH_SOURCE`
build_path="$script_path/build_js"

if [ ! -d "$build_path" ]; then
    mkdir "$build_path"
fi

cd "$build_path"
# Todo: Investigate
emcmake cmake .. -DCMAKE_INSTALL_PREFIX:PATH=${HOME}/opt
emmake make
emmake make install