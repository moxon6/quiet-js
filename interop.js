export default (imodule) => ({
    free: (opt) => imodule._free(opt),
    malloc: (bufferSize) => imodule._malloc(bufferSize),
    quietEncoderClampFrameLen: (encoder, sampleBufferSize) => imodule._quiet_encoder_clamp_frame_len(encoder, sampleBufferSize),
    quietEncoderCreate: (opt, sampleRate) => imodule._quiet_encoder_create(opt, sampleRate),
    quietEncoderDestroy: (encoder) => imodule._quiet_encoder_destroy(encoder),
    quietEncoderEmit: (encoder, samples, sampleBufferSize) => imodule._quiet_encoder_emit(encoder, samples, sampleBufferSize),
    quietEncoderGetFrameLen: (encoder) => imodule._quiet_encoder_get_frame_len(encoder),
    quietEncoderProfileStr: (cProfiles, cProfile) => imodule.ccall('quiet_encoder_profile_str', 'pointer', ['array', 'array'], [cProfiles, cProfile]),
    quietEncoderSend: (encoder, frame, byteLength) => imodule._quiet_encoder_send(encoder, frame, byteLength),
    subArray: (start, finish) => imodule.HEAPF32.subarray(start, finish),
    module: imodule
  });
  