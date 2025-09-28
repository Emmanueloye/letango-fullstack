import { model, Schema } from 'mongoose';

const groupSettingSchema = new Schema({
  cmemberLimit: {
    type: Number,
    required: [true, 'Contribution member limit field is required.'],
  },
  cGroupLimit: {
    type: Number,
    required: [true, 'Contribution group limit field is required.'],
  },
  chargePerNewMember: {
    type: Number,
    required: [true, 'Charge per new member field is required.'],
  },
  basicMemberLimit: {
    type: Number,
    required: [true, 'Basic Member limit field is required.'],
  },
  bronzeMemberLimit: {
    type: Number,
    required: [true, 'Bronze Member limit field is required.'],
  },
  goldMemberLimit: {
    type: Number,
    required: [true, 'Gold Member limit field is required.'],
  },
  diamondMemberLimit: {
    type: Number,
    required: [true, 'Diamond Member limit field is required.'],
  },
  basicCharge: {
    type: Number,
    required: [true, 'Basic Charge field is required.'],
  },
  bronzeCharge: {
    type: Number,
    required: [true, 'Bronze Charge field is required.'],
  },
  goldCharge: {
    type: Number,
    required: [true, 'Gold Charge field is required.'],
  },
  diamondCharge: {
    type: Number,
    required: [true, 'Diamond Charge field is required.'],
  },
});

export default model('GroupSetting', groupSettingSchema);
