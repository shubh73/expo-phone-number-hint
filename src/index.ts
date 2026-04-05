// Reexport the native module. On web, it will be resolved to ExpoPhoneNumberHintModule.web.ts
// and on native platforms to ExpoPhoneNumberHintModule.ts
export { default } from './ExpoPhoneNumberHintModule';
export { default as ExpoPhoneNumberHintView } from './ExpoPhoneNumberHintView';
export * from  './ExpoPhoneNumberHint.types';
