const TEMPLATES = {};

async function loadTemplates() {
    const [
        MENU_LINKS_TEMPLATE,
        HOME_TEMPLATE,
        LOGIN_REGISTER_TEMPLATE,
        CREATE_EDIT_TEMPLATE,
        LIST_ADS_TEMPLATE,
        AD_PARTIAL_TEMPLATE,
        AD_DETAILS_TEMPLATE
    ] = await Promise.all([
        $.get('./templates/menu-links.hbs'),
        $.get('./templates/home.hbs'),
        $.get('./templates/login-register.hbs'),
        $.get('./templates/create-edit.hbs'),
        $.get('./templates/list-ads.hbs'),
        $.get('./templates/single-ad-partial.hbs'),
        $.get('./templates/ad-details.hbs')
    ]);

    TEMPLATES['links'] = Handlebars.compile(MENU_LINKS_TEMPLATE);
    TEMPLATES['home'] = Handlebars.compile(HOME_TEMPLATE);
    TEMPLATES['loginRegister'] = Handlebars.compile(LOGIN_REGISTER_TEMPLATE);
    TEMPLATES['createEdit'] = Handlebars.compile(CREATE_EDIT_TEMPLATE);
    TEMPLATES['listAds'] = Handlebars.compile(LIST_ADS_TEMPLATE);
    TEMPLATES['adDetails'] = Handlebars.compile(AD_DETAILS_TEMPLATE);
    Handlebars.registerPartial('addRow', AD_PARTIAL_TEMPLATE);
}

function loadLinksTemplate(context) {
    let menu = $('#menu');
    menu.html(TEMPLATES.links(context));
    attachMenuLinksEvents();
}

function loadHomeTemplate() {
    $('#root').html(TEMPLATES.home());
}

function loadRegisterTemplate() {
    let context = createContext(
        'viewRegister',
        'register here',
        'formRegister',
        'buttonRegisterUser',
        'Register');

    $('#root').html(TEMPLATES.loginRegister(context));
    attachRegisterEvent();
}

function loadLoginTemplate() {
    let context = createContext(
        'viewLogin',
        'login',
        'formLogin',
        'buttonLoginUser',
        'Login');

    $('#root').html(TEMPLATES.loginRegister(context));
    attachLoginEvent();
}

function loadCreateTemplate() {
    let context = createContext(
        'viewCreateAd',
        'Create new Advertisement',
        'formCreateAd',
        'buttonCreateAd',
        'Create'
    );

    $('#root').html(TEMPLATES.createEdit(context));
    attachCreateEvent();
}

function loadEditTemplate() {
    let context = createContext(
        'viewEditAd',
        'Edit existing advertisement',
        'formEditAd',
        'buttonEditAd',
        'Edit'
    );

    context['isEdit'] = true;

    $('#root').html(TEMPLATES.createEdit(context));
    attachEditEvent();
}

function loadListAdsTemplate(context) {
    $('#root').html(TEMPLATES.listAds(context));
    attachViewEditDeleteEvents();
}

function loadAdDetailsTemplate() {
    $('#root').html(TEMPLATES.adDetails());
    attachBackBtnEvent();
}

function createContext(viewType, message, formType, buttonType, buttonValue) {
    return {
        viewType: viewType,
        message: message,
        formType: formType,
        buttonType: buttonType,
        buttonValue: buttonValue
    };
}