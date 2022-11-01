import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Message title is required'],
      trim: true,
    },
    message : {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('message', MessageSchema);

export default Message;