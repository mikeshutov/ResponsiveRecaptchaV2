/*@preserve
  Author: Mike Shutov
  Date: August 2019
  Description: Plugin which solves a few issues with the recaptchaV2 checkbox when it comes to styles on mobile devices and its overall ability to be styled. Also adds a few additional minor features which could be useful.
*/
(function(){
    // Common Variables
    var captchas = {};
    var state = '';
    // ResponsiveRecaptcha Constructor
    ResponsiveRecaptcha = function(settings){  
        if(state != 'ready' && state !='loading'){
            LoadRecaptchaAssets();
        }   
        if(CaptchaExists(settings.el)){
            console.log('Recaptcha Already Exists at element: ' + settings.el+'.');
            return;
        };
        captchas[settings.el] = Object.settings= {
            el:settings.el,
            siteKey:settings.sitekey,
            verifyCallback:settings.callback || function(){return;},
            expiredCallback: settings.expiredCallback || function(){return;},
            errorCallback: settings.errorCallback || function(){return;},
            verified: false,
            error: settings.error || false,
            wrapperClasses:settings.wrapperClasses || '',
            mode: settings.mode || 'horizontal',
            theme: settings.theme || 'light',
            expiredMessage: settings.expiredError || 'Verification expired. Check the recaptcha again.',
            errorMessage: settings.errorMessage || 'An Error Has Occured with Recaptcha.',
            errorCustom: settings.errorCustom || '',
            debug: false,
            tabindex: settings.tabindex || 0,
            errorPosition: settings.errorPosition || 'top'
        };
        this.props = captchas[settings.el];
        // If we have already loaded everything but a new recaptcha is being added we will just render that new recaptcha
        if(state === 'ready'){
            ResponsiveRecaptcha.renderOne(settings.el);
        }
        ResponsiveChallange();
    }    
    // Methods
    CaptchaExists = function(el){
        var captcha = Object.keys(captchas).filter(function(captcha){
            return captcha === el;
        })
        return captcha.length; 
    }
    LoadRecaptchaAssets = function(){
        state = 'loading';
        var scripts = document.getElementsByTagName('script');
        var scriptUrl = 'https://www.google.com/recaptcha/api.js?onload=renderCaptcha&render=explicit';
        for(script in scripts){
            if(scripts[script].src === scriptUrl){
                return;
            };
        };
        var s = document.createElement( 'script' );
        s.setAttribute( 'src', scriptUrl);
        s.async=true;
        s.defer=true;
        document.head.appendChild(s);
    }
    ResponsiveChallange = function(){
        var recaptchasLoaded = setInterval(recaptchasLoaded, 100);
        function recaptchasLoaded(){
            var challanges = document.querySelectorAll('iframe[title*="recaptcha challenge"]');
            if(challanges.length === ResponsiveRecaptcha.size()){
                recaptchasLoadedStop();
                challanges.forEach(function(chal){
                    chal.parentNode.parentNode.classList.add("recaptcha-challange");
                });
            };
        };
        function recaptchasLoadedStop(){
            clearInterval(recaptchasLoaded);
        };
    }
    ResponsiveRecaptchaError = function(el,mode,message){
        var errorMessage = '';
        if(mode === 'error'){
            errorMessage = captchas[el].errorMessage;
        } else if(mode === 'expired'){
            errorMessage = captchas[el].expiredMessage;
        } else if(mode === 'custom'){
            errorMessage = message;
        } 
        if(document.querySelectorAll('#'+el+' .responsiveRecaptcha .recaptcha-error .message').length > 0){
            document.querySelector('#'+el+' .responsiveRecaptcha .recaptcha-error .message').textContent = errorMessage;
        } else {
            var errorBlock = document.querySelector('#'+el+' .responsiveRecaptcha .recaptcha-error');
            errorBlock.classList.add(mode);
            errorBlock.innerHTML = '<p class="message">'+errorMessage+'</p>';
        }
    }
    ClearError = function(el){
        var errorBlock = document.querySelector('#'+el+' .responsiveRecaptcha .recaptcha-error');
        errorBlock.innerHTML = '';
    }
    ResetRecaptcha = function(recaptchaID){
        grecaptcha.reset(recaptchaID);
    }
    // Global ResponsiveRecaptcha Methods
    ResponsiveRecaptcha.size = function(){
        return Object.keys(captchas).length;
    }
    ResponsiveRecaptcha.renderOne = function(captchaEl){
        var re = document.createElement('div');
        re.className = 'responsiveRecaptcha '+captchas[captchaEl].mode+' '+captchas[captchaEl].theme;
        re.innerHTML = '<div class="recaptcha-error '+captchas[captchaEl].errorPosition+'"></div><div class="grecapWrapper '+captchas[captchaEl].wrapperClasses+'"><div class="recap"></div><div class="grecapTerms"><div class="g-recap-logo">'+
            '</div><div class="g-recap-logo-text">reCAPTCHA</div><div class="g-recap-logo-links">'+
            '<a href="https://www.google.com/intl/en/policies/privacy/" target="_blank">Privacy</a><span aria-hidden="true" role="presentation"> - </span>'+
            '<a href="https://www.google.com/intl/en/policies/terms/" target="_blank">Terms</a></div></div></div>';
        document.getElementById(captchaEl).appendChild(re);
        captchas[captchaEl].recaptcha = grecaptcha.render(document.querySelector('#'+captchaEl+' .recap'), {
            sitekey: captchas[captchaEl].siteKey,
            callback: function(token){
                captchas[captchaEl].verified = true;
                captchas[captchaEl].successToken = token;
                captchas[captchaEl].successTimestamp = Date.now();
                if(typeof(captchas[captchaEl].verifyCallback) === 'string'){
                    eval('('+captchas[captchaEl].verifyCallback+')();');
                }else{
                    captchas[captchaEl].verifyCallback(token, captchas[captchaEl]);
                }
            },
            'expired-callback': function(){ 
                setTimeout(function(){
                    ResetRecaptcha(captchas[captchaEl].recaptcha);
                },100);
                captchas[captchaEl].verified = false;
                delete captchas[captchaEl].successToken;
                delete captchas[captchaEl].successTimestamp;
                ResponsiveRecaptchaError(captchas[captchaEl].el,'expired');
                if(typeof(captchas[captchaEl].expiredCallback) === 'string'){
                    eval('('+captchas[captchaEl].expiredCallback+')();');
                } else {
                    captchas[captchaEl].expiredCallback(captchas[captchaEl]);
                }
            },
            'error-callback': function(){
                ResponsiveRecaptchaError(captchas[captchaEl].el);
                if(typeof(captchas[captchaEl].errorCallback) === 'string'){
                    eval('('+captchas[captchaEl].errorCallback+')();');
                } else {
                    captchas[captchaEl].errorCallback(captchas[captchaEl]);
                }
            },
            theme: captchas[captchaEl].theme,
            tabindex:captchas[captchaEl].tabindex,
        });
        captchas[captchaEl].rendered = true;
        captchas[captchaEl].initialized = Date.now();
        if(captchas[captchaEl].error===true){
            ResponsiveRecaptchaError(captchas[captchaEl].el,'custom',captchas[captchaEl].errorCustom)
        }
    };
    // Util Functions
    ResponsiveRecaptcha.renderAll = function(){
        for(captcha in captchas){
            if(captchas[captcha].rendered === true){
                continue;
            }
            ResponsiveRecaptcha.renderOne(captchas[captcha].el);
        }
    }
    ResponsiveRecaptcha.setState = function(newState){
        state = newState;
    }
    ResponsiveRecaptcha.getAll = function(){
        return captchas;
    };
    ResponsiveRecaptcha.getBySelector = function(el){
        return captchas[el];
    };
    // API Per Recaptcha Methods
    ResponsiveRecaptcha.prototype.reset = function(){
        ResetRecaptcha(this.props.recaptcha);
    };
    ResponsiveRecaptcha.prototype.getResponse = function(){
        return grecaptcha.getResponse(this.props.recaptcha);
    };
    ResponsiveRecaptcha.prototype.setError = function(mode,message){
        if(!mode){
            return console.log('Please provide a mode (error,expired,custom)');
        } else if(['error','expired','custom'].indexOf(mode)===-1){
            return console.log('Invalid Mode');
        }
        ResponsiveRecaptchaError(this.props.el,mode,message);
    };
    ResponsiveRecaptcha.prototype.clearError = function(){
        ClearError(this.props.el);
    };
    // Auto Render
    document.querySelectorAll('.g-recaptcha').forEach(function(recap){
        if(!recap.id){
            recap.id = 'autoResponsiveRecaptcha-'+Date.now();
        }
        var _settings ={el:recap.id};
        for(data in recap.dataset){
            _settings[data] = recap.dataset[data];
            if(data==='error'){
                _settings[data] = true;
            }
        } 
        ResponsiveRecaptcha(_settings);
    });
    // Add ResponsiveRecaptcha to window
    window.ResponsiveRecaptcha = ResponsiveRecaptcha;
})();

function renderCaptcha(){
    ResponsiveRecaptcha.setState('ready');
    ResponsiveRecaptcha.renderAll();
};