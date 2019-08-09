# ResponsiveRecaptchaV2

This project is a small plugin which solves a few common styling problems when it comes to making a mobile friendly/stylable checkbox recaptcha. It is just one solution which worked for me which ive decided to turn into a plugin. If you find any bugs/issues/feedback/suggestions feel free to create an issue and I will try to address them in a timely manner. Otherwise I will try to update it with a few more methods/fix a few bugs. May add events as well.


**Documentation still being worked on**



## Dependencies:
None

## Installation:
Download and use the dist files. 
**Note:** You do not need to add the google recaptcha js file the plugin will handle this for you.

## Basic Usage:
Once you have downloaded and included the js and css files there are a few ways to use the plugin.

**Explicit Rendering**
Initialize the recaptcha of your choice by calling ResponsiveRecaptcha and passing an object with the el and sitekey where el is the id of the element you are using.
```
ResponsiveRecaptcha({
  el:'your-element-id',
  sitekey:'your-site-key-here' 
});
```

**OR:**
This will let you call a few custom methods and have access to a few custom properties which are added by the plugin.
```
var recaptcha = ResponsiveRecaptcha({
  el:'your-element-id',
  sitekey:'your-site-key-here' 
});
```

**Automatic Rendering**
Nothing changes as long as you are using the plugin.
```
<div class="g-recaptcha" data-sitekey="your-site-key" ></div>
```

# Other properties which can be passed:
- callback: Use this for your success callback. You will get access to the token same as before and also the whole ResponsiveRecaptcha object as a second value.
- expiredCallback: Use this for your expired callback. As above this will also give you access to the Recaptcha object which was created.
- errorCallback: Use this for your error callback. This will also contain the object.
- theme: If you wish to use the dark theme simply pass this as 'dark'.
- error: If you wish to start the recaptcha in error mode.
- errorCustom: If you start the recaptcha in error mode what message you wish to display.
- errorPosition: Where should the error be displayed. Available options are: top,bottom,left,right defaults to top.
- mode: Which layout you wish to show the recaptcha in (horizontal,vertical) defaults to horizontal.

## Properties and Methods Available in the ResponsiveRecaptcha object
# Properties:
- el : This objects recaptcha's related ID attribute.
- initialized : a timestamp when the recaptcha was rendered. 
- successTimestamp : timestamp when the recaptcha was completed successfully.
- successToken : the success token for this particular recaptcha object.
# Methods:
- setError(mode,message) : This lets you set a custom error for the recaptcha modes available are: error,expired,custom. Error and Expired will display the same message as they would for the error callback and the expired callback, custom is if you wish to display a custom error.
- clearError() : This function clears the error.
- reset() : iIf you wish to reset or rerender some recaptcha you could just call this method.

## Examples:
