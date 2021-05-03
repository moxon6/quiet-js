export default (imodule) => ({
    free: (opt) => imodule.exports.free(opt),
    malloc: (bufferSize) => imodule.exports.malloc(bufferSize),
    quietEncoderClampFrameLen: (encoder, sampleBufferSize) => imodule.exports.quiet_encoder_clamp_frame_len(encoder, sampleBufferSize),
    quietEncoderCreate: (opt, sampleRate) => imodule.exports.quiet_encoder_create(opt, sampleRate),
    quietEncoderDestroy: (encoder) => imodule.exports.quiet_encoder_destroy(encoder),
    quietEncoderEmit: (encoder, samples, sampleBufferSize) => imodule.exports.quiet_encoder_emit(encoder, samples, sampleBufferSize),
    quietEncoderGetFrameLen: (encoder) => imodule.exports.quiet_encoder_get_frame_len(encoder),
    quietEncoderProfileStr: (cProfiles, cProfile) => imodule.exports.quiet_encoder_profile_str(cProfiles, cProfile),
    quietEncoderSend: (encoder, frame, byteLength) => imodule.exports.quiet_encoder_send(encoder, frame, byteLength),
    subArray: (start, finish) => imodule.HEAPF32.subarray(start, finish),
    module: imodule
  });
  