em++ \
    -I${HOME}/opt/include \
    -L${HOME}/opt/lib \
    -lquiet \
    -lliquid \
    -ljansson \
    -lfec \
    -o quiet.wasm \
    --no-entry \
    -s MODULARIZE=1 \
    -s STRICT=1 \
    -s EXPORTED_FUNCTIONS='[
        "_free",
        "_malloc",
        "_quiet_encoder_clamp_frame_len",
        "_quiet_encoder_create",
        "_quiet_encoder_destroy",
        "_quiet_encoder_emit",
        "_quiet_encoder_get_frame_len",
        "_quiet_encoder_profile_str",
        "_quiet_encoder_send",
        "_quiet_decoder_profile_str",
        "_quiet_decoder_create"
    ]'