// Disable auto scroll on hash url
$(window).unload(function() {
    $(window).scrollTop(0);
});

let menulinks = $('.goto-block');
let rightElement = $('#layout-right');
let headerElement = $('.header').first();
let sidebarIsOpen = true;

function removeMenuHighlight() {
    menulinks.removeClass('visited');
}

function addMenuHighlight(blockName) {
    let blockRegex = new RegExp('#/' + blockName + '$');
    menulinks.each(function() {
        if (blockRegex.test($(this).attr('href'))) {
            $(this).addClass('visited');
        }
    });
}

$(window).on('load', function() {
    $('pre').each(function() {
        hljs.highlightBlock(this);
    });

    menulinks.on('click', goToBlock);

    $('.toggler').first().on('click', toggleSiderbarFromMenu);

    $('li .mb').each(function() {
        $(this).parent().css('marginBottom', '20px');
    });

    checkPage();
    toggleSidebar();
});

function syncTitle(el) {
    const title = $(el).find('h1').text();
    document.title = title || 'Unknown';
}

function _goToBlock(blockName, sectionId = null) {
    removeMenuHighlight();
    addMenuHighlight(blockName);

    let intros = $('.intro');
    intros.each(function() {
        if ($(this).attr('id') === 'block-' + blockName) {
            $(this).removeClass('hide');
            syncTitle(this);
        } else {
            $(this).addClass('hide');
        }
    });

    if (sidebarIsOpen && $(window).width() < 900) {
        toggleSiderbarFromMenu();
    }

    if (sectionId !== null) {
        setTimeout(function() {
            scrollToSection(sectionId);
        }, 100);
    } else {
        rightElement.scrollTop(0);
    }
}

function goToBlock(event) {
    event.preventDefault();
    let target = $(event.target);
    if (target.attr('hash') === undefined) {
        target = target.parent();
    }

    let blockName = target.attr('hash').replace('#/', '');
    let sectionId = null;
    if (blockName.includes('#')) {
        blockName = blockName.split('#');
        sectionId = blockName.join('-');
        blockName = blockName[0];
    }

    history.pushState(null, '', `${target.attr('pathname')}${target.attr('hash')}`);
    _goToBlock(blockName, sectionId);
}

function resetHome(event) {
    event.preventDefault();
    window.location.hash = 'home';
    menulinks.removeClass('visited');
    $('.intro').removeClass('hide');
}

function checkPage() {
    if (window.location.hash) {
        let sectionId = null;
        let blockName = window.location.hash.replace('#/', '');
        if (blockName.includes('#')) {
            blockName = blockName.split('#');
            sectionId = blockName.join('-');
            blockName = blockName[0];
        }
        _goToBlock(blockName, sectionId);
    }
}

function scrollToSection(sectionId) {
    let sectionElement = $('#' + sectionId);
    let navHeight = headerElement.outerHeight() + 10;
    rightElement.scrollTop(sectionElement.offset().top - navHeight);
}

$(window).on('resize', function() {
    toggleSidebar();
});

function toggleSidebar() {
    if ($(window).width() < 900) {
        if (sidebarIsOpen) {
            $('.left').first().hide();
            sidebarIsOpen = false;
        }
    }
    else {
        if (!sidebarIsOpen) {
            $('.left').first().show();
            sidebarIsOpen = true;
        }
    }
}

function toggleSiderbarFromMenu() {
    if (sidebarIsOpen) {
        $('.left').first().hide();
    } else {
        $('.left').first().show();
    }
    sidebarIsOpen = !sidebarIsOpen;
}

$(window).on('popstate', function(event) {
    // The popstate event is fired each time when the current history entry changes.
    let sectionId = null;
    let blockName = window.location.hash.replace('#/', '');
    if (blockName.includes('#')) {
        blockName = blockName.split('#');
        sectionId = blockName.join('-');
        blockName = blockName[0];
    }
    if (blockName === '') {
        blockName = 'home';
    }
    _goToBlock(blockName, sectionId);
});
