/// <reference path="../../toastr.js" />
/// <reference path="../../node_modules/qunit/qunit/qunit.js" />
(function () {
    var iconClasses = {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
    };
    var positionClasses = {
        topRight: 'toast-top-right',
        bottomRight: 'toast-bottom-right',
        bottomLeft: 'toast-bottom-left',
        topLeft: 'toast-top-left',
        topCenter: 'toast-top-center',
        bottomCenter: 'toast-bottom-center'
    };
    var sampleMsg = 'I don\'t think they really exist';
    var sampleTitle = 'TEST';
    var selectors = {
        container: 'div#toast-container',
        toastInfo: 'div#toast-container > div.toast-info',
        toastWarning: 'div#toast-container > div.toast-success',
        toastError: 'div#toast-container > div.toast-error',
        toastSuccess: 'div#toast-container > div.toast-success'
    };

    toastr.options = {
        timeOut: 2000,
        extendedTimeOut: 0,
        fadeOut: 0,
        fadeIn: 0,
        showDuration: 0,
        hideDuration: 0,
        debug: false
    };

    var delay = toastr.options.timeOut + 500;

    // 'Clears' must go first
    QUnit.module('clear');
    QUnit.test('clear - show 3 toasts, clear the 2nd', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        $toast[2] = toastr.info(sampleMsg, sampleTitle + '-3');
        var $container = toastr.getContainer();
        //Act
        toastr.clear($toast[1]);
        //Assert
        setTimeout(function () {
            assert.ok($container && $container.children().length === 2);
            //Teardown
            resetContainer();
            done();
        }, 1000);
    });
    QUnit.test('clear - show 3 toasts, clear all 3, 0 left', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        $toast[2] = toastr.info(sampleMsg, sampleTitle + '-3');
        var $container = toastr.getContainer();
        //Act
        toastr.clear();
        //Assert
        setTimeout(function () {
            assert.ok($container && $container.children().length === 0);
            //Teardown
            resetContainer();
            done();
        }, delay);
    });
    QUnit.test('clear - after clear with force option toast with focus disappears', function (assert) {
        //Arrange
        var $toast;
        var msg = sampleMsg + '<br/><br/><button type="button">Clear</button>';
        //Act
        $toast = toastr.info(msg, sampleTitle + '-1');
        $toast.find('button').focus();
        toastr.clear($toast, { force: true });
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container && $container.children().length === 0, 'Focused toast after a clear with force is not visible');
        //Teardown
        resetContainer();
    });
    QUnit.test('clear and show - show 2 toasts, clear both, then show 1 more', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        var $container = toastr.getContainer();
        toastr.clear();
        //Act
        setTimeout(function () {
            $toast[2] = toastr.info(sampleMsg, sampleTitle + '-3-Visible');
            //Assert
            assert.equal($toast[2].find('div.toast-title').html(), sampleTitle + '-3-Visible', 'Finds toast after a clear');
            assert.ok($toast[2].is(':visible'), 'Toast after a clear is visible');
            //Teardown
            resetContainer();
            done();
        }, delay);
    });
    QUnit.test('clear and show - clear removes toast container', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        var $container = toastr.getContainer();
        toastr.clear();
        //Act
        setTimeout(function () {
            //Assert
            assert.equal($(selectors.container).length, 0, 'Toast container does not exist');
            assert.ok(!$toast[1].is(':visible'), 'Toast after a clear is visible');
            //Teardown
            resetContainer();
            done();
        }, delay);
    });
    QUnit.test('clear and show - after clear new toast creates container', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        var $container = toastr.getContainer();
        toastr.clear();
        //Act
        setTimeout(function () {
            $toast[2] = toastr.info(sampleMsg, sampleTitle + '-3-Visible');
            //Assert
            assert.equal($(selectors.container).find('div.toast-title').html(), sampleTitle + '-3-Visible', 'Finds toast after a clear'); //Teardown
            resetContainer();
            done();
        }, delay);
    });
    QUnit.test('clear and show - clear toast after hover', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = toastr.info(sampleMsg, sampleTitle);
        var $container = toastr.getContainer();
        $toast.trigger("mouseout");
        //Act
        setTimeout(function () {
            //Assert
            assert.ok($container.find('div.toast-title').length === 0, 'Toast clears after a mouse hover'); //Teardown
            resetContainer();
            done();
        }, 500);
    });
    QUnit.test('clear and show - do not clear toast after hover', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = toastr.info(sampleMsg, sampleTitle, { closeOnHover: false });
        var $container = toastr.getContainer();
        $toast.trigger("mouseout");
        //Act
        setTimeout(function () {
            //Assert
            assert.ok($container.find('div.toast-title').length === 1, 'Toast does not clear after a mouse hover'); //Teardown
            resetContainer();
            done();
        }, 500);
    });
    QUnit.test('clear and show - after clear all toasts new toast still appears', function (assert) {
        //Arrange
        var $toast = [];
        //Act
        $toast[0] = toastr.info(sampleMsg, sampleTitle + '-1');
        $toast[1] = toastr.info(sampleMsg, sampleTitle + '-2');
        toastr.clear();
        $toast[2] = toastr.info(sampleMsg, sampleTitle + '-3-Visible');
        //Assert
        assert.ok($toast[2].is(':visible'), 'Toast after a clear is visible');
        //Teardown
        resetContainer();
    });
    QUnit.module('info');
    QUnit.test('info - pass title and message', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.info(sampleMsg, sampleTitle);
        //Assert
        assert.equal($toast.find('div.toast-title').html(), sampleTitle, 'Sets title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.info), 'Sets info icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('info - pass message, but no title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.info(sampleMsg);
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets null title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.info), 'Sets info icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('info - pass no message nor title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.info(); //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets null title');
        assert.equal($toast.find('div.toast-message').html(), null, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.info), 'Sets info icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.module('warning');
    QUnit.test('warning - pass message and title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.warning(sampleMsg, sampleTitle);
        //Assert
        assert.equal($toast.find('div.toast-title').html(), sampleTitle, 'Sets title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.warning), 'Sets warning icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('warning - pass message, but no title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.warning(sampleMsg);
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets empty title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.warning), 'Sets warning icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('warning - no message nor title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.warning('');
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets null title');
        assert.equal($toast.find('div.toast-message').length, 0, 'Sets empty message');
        assert.ok($toast.hasClass(iconClasses.warning), 'Sets warning icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.module('error');
    QUnit.test('error - pass message and title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.error(sampleMsg, sampleTitle);
        //Assert
        assert.equal($toast.find('div.toast-title').html(), sampleTitle, 'Sets title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.error), 'Sets error icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('error - pass message, but no title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.error(sampleMsg); //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets empty title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.error), 'Sets error icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('error - no message nor title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.error('');
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets empty title');
        assert.equal($toast.find('div.toast-message').length, 0, 'Sets empty message');
        assert.ok($toast.hasClass(iconClasses.error), 'Sets error icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.module('success');
    QUnit.test('success - pass message and title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        //Assert
        assert.equal($toast.find('div.toast-title').html(), sampleTitle, 'Sets title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.success), 'Sets success icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('success - pass message, but no title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.success(sampleMsg);
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets empty title');
        assert.equal($toast.find('div.toast-message').html(), sampleMsg, 'Sets message');
        assert.ok($toast.hasClass(iconClasses.success), 'Sets success icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('success - no message nor title', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('div.toast-title').length, 0, 'Sets null title');
        assert.equal($toast.find('div.toast-message').length, 0, 'Sets empty message');
        assert.ok($toast.hasClass(iconClasses.success), 'Sets success icon'); //Teardown
        $toast.remove();
        clearContainerChildren();
    });


    QUnit.module('escape html', {
        afterEach: function () {
            toastr.options.escapeHtml = false;
        }
    });
    QUnit.test('info - escape html', function (assert) {
        //Arrange
        toastr.options.escapeHtml = true;
        //Act
        var $toast = toastr.info('html <strong>message</strong>', 'html <u>title</u>');
        //Assert
        assert.equal($toast.find('div.toast-title').html(), 'html &lt;u&gt;title&lt;/u&gt;', 'Title is escaped');
        assert.equal($toast.find('div.toast-message').html(), 'html &lt;strong&gt;message&lt;/strong&gt;', 'Message is escaped');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('warning - escape html', function (assert) {
        //Arrange
        toastr.options.escapeHtml = true;
        //Act
        var $toast = toastr.warning('html <strong>message</strong>', 'html <u>title</u>');
        //Assert
        assert.equal($toast.find('div.toast-title').html(), 'html &lt;u&gt;title&lt;/u&gt;', 'Title is escaped');
        assert.equal($toast.find('div.toast-message').html(), 'html &lt;strong&gt;message&lt;/strong&gt;', 'Message is escaped');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('error - escape html', function (assert) {
        //Arrange
        toastr.options.escapeHtml = true;
        //Act
        var $toast = toastr.error('html <strong>message</strong>', 'html <u>title</u>');
        //Assert
        assert.equal($toast.find('div.toast-title').html(), 'html &lt;u&gt;title&lt;/u&gt;', 'Title is escaped');
        assert.equal($toast.find('div.toast-message').html(), 'html &lt;strong&gt;message&lt;/strong&gt;', 'Message is escaped');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('success - escape html', function (assert) {
        //Arrange
        toastr.options.escapeHtml = true;
        //Act
        var $toast = toastr.success('html <strong>message</strong>', 'html <u>title</u>');
        //Assert
        assert.equal($toast.find('div.toast-title').html(), 'html &lt;u&gt;title&lt;/u&gt;', 'Title is escaped');
        assert.equal($toast.find('div.toast-message').html(), 'html &lt;strong&gt;message&lt;/strong&gt;', 'Message is escaped');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });

    QUnit.module('closeButton', {
        afterEach: function () {
            toastr.options.closeButton = false;
        }
    });
    QUnit.test('close button disabled', function (assert) {
        //Arrange
        toastr.options.closeButton = false;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('button.toast-close-button').length, 0, 'close button should not exist with closeButton=false');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('close button enabled', function (assert) {
        //Arrange
        toastr.options.closeButton = true;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('button.toast-close-button').length, 1, 'close button should exist with closeButton=true');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('close button has type=button', function (assert) {
        //Arrange
        toastr.options.closeButton = true;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('button[type="button"].toast-close-button').length, 1, 'close button should have type=button');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('close button duration', function (assert) {
        var done = assert.async();
        //Arrange
        toastr.options.closeButton = true;
        toastr.options.closeDuration = 0;
        toastr.options.hideDuration = 2000;
        var $container = toastr.getContainer();
        //Act
        var $toast = toastr.success('');
        $toast.find('button.toast-close-button').click();
        setTimeout(function () {
            //Assert
            assert.ok($container && $container.children().length === 0, 'close button should support own hide animation');
            //Teardown
            toastr.options.hideDuration = 0;
            resetContainer();
            done();
        }, 500);
    });

    QUnit.module('progressBar', {
        afterEach: function () {
            toastr.options.progressBar = false;
        }
    });
    QUnit.test('progress bar disabled', function (assert) {
        //Arrange
        toastr.options.progressBar = false;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('div.toast-progress').length, 0, 'progress bar should not exist with progressBar=false');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('progress bar enabled', function (assert) {
        //Arrange
        toastr.options.progressBar = true;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.equal($toast.find('div.toast-progress').length, 1, 'progress bar should exist with progressBar=true');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });

    QUnit.module('rtl', {
        afterEach: function () {
            toastr.options.rtl = false;
        }
    });
    QUnit.test('toastr is ltr by default', function (assert) {
        //Arrange
        //Act
        //Assert
        toastr.subscribe(function(response) {
            assert.equal(response.options.rtl, false, 'ltr by default (i.e. rtl=false)');
        });
        var $toast = toastr.success('');
        //Teardown
        toastr.subscribe(null);
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('ltr toastr does not have .rtl class', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.ok($toast.hasClass('rtl') === false, 'ltr div container does not have .rtl class');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('rtl toastr has .rtl class', function (assert) {
        //Arrange
        toastr.options.rtl = true;
        //Act
        var $toast = toastr.success('');
        //Assert
        assert.ok($toast.hasClass('rtl'), 'rtl div container has .rtl class');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });

    QUnit.module('accessibility');
    QUnit.test('toastr success has aria polite', function (assert) {
        // Arrange
        var $toast = toastr.success('');

        // Act
        assert.ok($toast.attr('aria-live')==='polite', 'success toast has aria-live of polite');

        // Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('toastr info has aria polite', function (assert) {
        // Arrange
        var $toast = toastr.info('');

        // Act
        assert.ok($toast.attr('aria-live')==='polite', 'info toast has aria-live of polite');

        // Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('toastr warning has aria assertive', function (assert) {
        // Arrange
        var $toast = toastr.warning('');

        // Act
        assert.ok($toast.attr('aria-live')==='assertive', 'warning toast has aria-live of assertive');

        // Teardown
        $toast.remove();
        clearContainerChildren();
    });
    QUnit.test('toastr error has aria assertive', function (assert) {
        // Arrange
        var $toast = toastr.error('');

        // Act
        assert.ok($toast.attr('aria-live')==='assertive', 'error toast has aria-live of assertive');

        // Teardown
        $toast.remove();
        clearContainerChildren();
    });

    QUnit.module('event', {
        afterEach: function () {
            toastr.options.closeButton = false;
            toastr.options.hideDuration = 0;
        }
    });
    QUnit.test('event - onShown is executed', function (assert) {
        var done = assert.async();
        // Arrange
        var run = false;
        var onShown = function () { run = true; };
        toastr.options.onShown = onShown;
        // Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        setTimeout(function () {
            // Assert
            assert.ok(run);
            //Teardown
            $toast.remove();
            clearContainerChildren();
            done();
        }, delay);
    });

    QUnit.test('event - onHidden is executed', function (assert) {
        var done = assert.async();
        //Arrange
        var run = false;
        var onHidden = function () { run = true; };
        toastr.options.onHidden = onHidden;
        toastr.options.timeOut = 1;
        //Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        setTimeout(function () {
            // Assert
            assert.ok(run); //Teardown
            $toast.remove();
            clearContainerChildren();
            done();
        }, delay);
    });

    QUnit.test('event - onShown and onHidden are both executed', function (assert) {
        var done = assert.async();
        //Arrange
        var onShowRun = false;
        var onHideRun = false;
        var onShow = function () { onShowRun = true; };
        var onHide = function () { onHideRun = true; };
        toastr.options.onShown = onShow;
        toastr.options.onHidden = onHide;
        toastr.options.timeOut = 1;
        //Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        setTimeout(function () {
            // Assert
            assert.ok(onShowRun);
            assert.ok(onHideRun);
            //Teardown
            $toast.remove();
            clearContainerChildren();
            done();
        }, delay);
    });

    QUnit.test('event - onCloseClick is executed', function (assert) {
        var done = assert.async();
        //Arrange
        var run = false;
        toastr.options.closeButton = true;
        toastr.options.closeDuration = 0;
        toastr.options.hideDuration = 2000;
        var onCloseClick = function () { run = true; };
        toastr.options.onCloseClick = onCloseClick;
        toastr.options.timeOut = 1;
        //Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        $toast.find('button.toast-close-button').click();
        setTimeout(function () {
            // Assert
            assert.ok(run);
            //Teardown
            $toast.remove();
            clearContainerChildren();
            done();
        }, delay);
    });

    QUnit.test('event - message appears when no show or hide method functions provided', function (assert) {
        //Arrange
        //Act
        var $toast = toastr.success(sampleMsg, sampleTitle);
        //Assert
        assert.ok($toast.hasClass(iconClasses.success), 'Sets success icon');
        //Teardown
        $toast.remove();
        clearContainerChildren();
    });

    QUnit.test('event - prevent duplicate sequential toasts.', function (assert){
        toastr.options.preventDuplicates = true;

        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle);
        $toast[1] = toastr.info(sampleMsg, sampleTitle);
        $toast[2] = toastr.info(sampleMsg + " 1", sampleTitle);
        $toast[3] = toastr.info(sampleMsg, sampleTitle);
        var $container = toastr.getContainer();

        assert.ok($container && $container.children().length === 3);

        clearContainerChildren();
    });

    QUnit.test('event - prevent duplicate sequential toasts, but allow previous after clear.', function (assert){
        toastr.options.preventDuplicates = true;

        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle);
        $toast[1] = toastr.info(sampleMsg, sampleTitle);
        clearContainerChildren();
        $toast[2] = toastr.info(sampleMsg, sampleTitle);
        var $container = toastr.getContainer();

        assert.ok($container && $container.children().length === 1);
        clearContainerChildren();
    });

    QUnit.test('event - allow duplicate sequential toasts.', function (assert){
        toastr.options.preventDuplicates = false;

        var $toast = [];
        $toast[0] = toastr.info(sampleMsg, sampleTitle);
        $toast[1] = toastr.info(sampleMsg, sampleTitle);
        $toast[2] = toastr.info(sampleMsg, sampleTitle);
        var $container = toastr.getContainer();

        assert.ok($container && $container.children().length === 3);

        clearContainerChildren();
    });

    QUnit.test('event - allow preventDuplicates option to be overridden.', function (assert) {
        var $toast = [];

        $toast[0] = toastr.info(sampleMsg, sampleTitle, {
            preventDuplicates: true
        });
        $toast[1] = toastr.info(sampleMsg, sampleTitle, {
            preventDuplicates: true
        });
        $toast[2] = toastr.info(sampleMsg, sampleTitle);
        var $container = toastr.getContainer();

        assert.ok($container && $container.children().length === 2);
        clearContainerChildren();
    });

    QUnit.module('subscription');
    QUnit.test('subscribe - triggers 2 visible and 2 hidden response notifications while clicking on a toast', function (assert) {
        var done = assert.async();
        //Arrange
        var $toast = [];
        var expectedReponses = [];
        //Act
        toastr.subscribe(function(response) {
          if(response.options.testId) {
            expectedReponses.push(response);
          }
        })

        $toast[0] = toastr.info(sampleMsg, sampleTitle, {testId : 1});
        $toast[1] = toastr.info(sampleMsg, sampleTitle, {testId : 2});

        $toast[1].click()

        setTimeout(function () {
            // Assert
            assert.ok(expectedReponses.length === 4);
            //Teardown
            clearContainerChildren();
            toastr.subscribe(null);
            done();
        }, delay);
    });

    QUnit.module('order of appearance');
    QUnit.test('Newest toast on top', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.newestOnTop = true;
        //Act
        var $first = toastr.success("First toast");
        var $second = toastr.success("Second toast");
        //Assert
        var containerHtml = toastr.getContainer().html();
        assert.ok(containerHtml.indexOf("First toast") > containerHtml.indexOf("Second toast"), 'Newest toast is on top');
        //Teardown
        $first.remove();
        $second.remove();
        resetContainer();
    });

    QUnit.test('Oldest toast on top', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.newestOnTop = false;
        //Act
        var $first = toastr.success("First toast");
        var $second = toastr.success("Second toast");
        //Assert
        var containerHtml = toastr.getContainer().html();
        assert.ok(containerHtml.indexOf("First toast") < containerHtml.indexOf("Second toast"), 'Oldest toast is on top');
        //Teardown
        $first.remove();
        $second.remove();
        resetContainer();
    });

    // These must go last
    QUnit.module('positioning');
    QUnit.test('Container - position top-right', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.positionClass = positionClasses.topRight;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.topRight), 'Has position top right');
        //Teardown
        $toast.remove();
        resetContainer();
    });
    QUnit.test('Container - position bottom-right', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.positionClass = positionClasses.bottomRight;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.bottomRight), 'Has position bottom right');
        //Teardown
        $toast.remove();
        resetContainer();
    });
    QUnit.test('Container - position bottom-left', function (assert) {
        //Arrange
        resetContainer();
        //$(selectors.container).remove()
        toastr.options.positionClass = positionClasses.bottomLeft;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.bottomLeft), 'Has position bottom left');
        //Teardown
        $toast.remove();
        resetContainer();
    });
    QUnit.test('Container - position top-left', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.positionClass = positionClasses.topLeft;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.topLeft), 'Has position top left');
        //Teardown
        $toast.remove();
        resetContainer();
    });
    QUnit.test('Container - position top-center', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.positionClass = positionClasses.topCenter;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.topCenter), 'Has position top center');
        //Teardown
        $toast.remove();
        resetContainer();
    });
    QUnit.test('Container - position bottom-center', function (assert) {
        //Arrange
        resetContainer();
        toastr.options.positionClass = positionClasses.bottomCenter;
        //Act
        var $toast = toastr.success(sampleMsg);
        var $container = toastr.getContainer();
        //Assert
        assert.ok($container.hasClass(positionClasses.bottomCenter), 'Has position bottom center');
        //Teardown
        $toast.remove();
        resetContainer();
    });

    function resetContainer() {
        var $container = toastr.getContainer();
        if ($container) {
            $container.remove();
        }
        $(selectors.container).remove();
        clearContainerChildren();
    }

    function clearContainerChildren() {
        toastr.clear();
    }

})();
