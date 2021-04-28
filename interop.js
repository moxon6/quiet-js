export default (imodule) => ({
    free: (opt) => imodule.ccall('free', null, ['pointer'], [opt]),
    intArrayFromString: (str) => imodule.intArrayFromString(str),
    malloc: (bufferSize) => imodule.ccall('malloc', 'pointer', ['number'], [bufferSize]),
    quietEncoderClampFrameLen: (encoder, sampleBufferSize) => imodule.ccall('quiet_encoder_clamp_frame_len', 'number', ['pointer', 'number'], [encoder, sampleBufferSize]),
    quietEncoderCreate: (opt, sampleRate) => imodule.ccall('quiet_encoder_create', 'pointer', ['pointer', 'number'], [opt, sampleRate]),
    quietEncoderDestroy: (encoder) => imodule.ccall('quiet_encoder_destroy', null, ['pointer'], [encoder]),
    quietEncoderEmit: (encoder, samples, sampleBufferSize) => imodule.ccall('quiet_encoder_emit', 'number', ['pointer', 'pointer', 'number'], [encoder, samples, sampleBufferSize]),
    quietEncoderGetFrameLen: (encoder) => imodule.ccall('quiet_encoder_get_frame_len', 'number', ['pointer'], [encoder]),
    quietEncoderProfileStr: (cProfiles, cProfile) => imodule.ccall('quiet_encoder_profile_str', 'pointer', ['array', 'array'], [cProfiles, cProfile]),
    quietEncoderSend: (encoder, frame, byteLength) => imodule.ccall('quiet_encoder_send', 'number', ['pointer', 'array', 'number'], [encoder, frame, byteLength]),
    subArray: (start, finish) => imodule.HEAPF32.subarray(start, finish),
  });
  