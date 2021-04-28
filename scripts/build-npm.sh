source ~/dev/emsdk/emsdk_env.sh

em++ \
    -I/home/martin/opt/include \
    -L/home/martin/opt/lib \
    -lquiet \
    -lliquid \
    -ljansson \
    -lfec \
    -o build.js \
    --no-entry \
    -s MODULARIZE=1 \
    -s STRICT=1 \
    -s EXPORTED_FUNCTIONS='["_free","_malloc","_quiet_encoder_clamp_frame_len","_quiet_encoder_create","_quiet_encoder_destroy","_quiet_encoder_emit","_quiet_encoder_get_frame_len","_quiet_encoder_profile_str","_quiet_encoder_send"]' \
    -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap", "intArrayFromString"]'
cp quiet/quiet-profiles.json .