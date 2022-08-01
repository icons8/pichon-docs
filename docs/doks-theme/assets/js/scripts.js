( function( $ ) {
	'use strict';

	(function() {

		// проверяем поддержку
		if (!Element.prototype.closest) {
	
			// реализуем
			Element.prototype.closest = function(css) {
				var node = this;
	
				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}
	
	})();
	
	(function() {
	
		// проверяем поддержку
		if (!Element.prototype.matches) {
	
			// определяем свойство
			Element.prototype.matches = Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector;
	
		}
	
	})();
	
	if (getCurrentNavLink()) {
		getCurrentNavLink().closest("li").classList.add("active");
		getCurrentNavLink().closest("li").innerHTML += createNavSubMenu();
	}
	if (document.querySelector('#micro-nav.release-note ')) {
		createNavSubMenuReleaseNote(document.querySelectorAll("#content h1, #content h2:not(.content__title)"))
	}
	$('#site-header-burger').click(function (){
		$('#mobile-menu').toggleClass('active')
		$(this).toggleClass('active')
	});
	$('.btn--back-top').click(function() {
		$("html, body").animate({scrollTop: 0,}) 
	});
	
	// Reduce
	$.fn.reduce = function( fnReduce, initialValue ) {
		var values = this,
				previousValue = initialValue;

		values.each( function( index, currentValue ) {
			previousValue = fnReduce.call(
				currentValue,

				previousValue,
				currentValue,
				index,
				values
			);
		} );

		return previousValue;
	};

	// Title sections
	$( ':header[id]' ).each( function() {
		var $self = $( this );

		$self.html(
			'<a href="#' + $self.attr( 'id' ) + '" class="title-anchor-link">#</a> ' + $self.html()
		);
	} );

	var getHeadingLevel = function( $el ) {
		var tagName = $el.prop( 'tagName' ).toLowerCase();

		if (
			! tagName ||
			[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].indexOf( tagName ) === -1
		) {
			return false;
		}

		return parseInt( tagName.replace( 'h', '' ), 10 );
	};

	var headings = $( ':header[id]' ).reduce( function( previousValue, currentValue ) {
		var currentHeading = {
			childrens: [],
		};

		currentHeading.$el = $( currentValue );
		currentHeading.level = getHeadingLevel( currentHeading.$el );

		if ( ! currentHeading.$el.length || currentHeading.level === false ) {
			return previousValue;
		}

		previousValue.push( currentHeading );

		return previousValue;
	}, [] );

	var majik = function( previousValue, currentHeading ) {
		if ( ! currentHeading.$el.length || currentHeading.level === false ) {
			return previousValue;
		}

		if ( previousValue.length < 1 ) {
			return [ currentHeading ];
		}

		var previousHeadingLevel = previousValue[ previousValue.length - 1 ].level;

		if ( currentHeading.level > previousHeadingLevel ) {
			previousValue[ previousValue.length - 1 ].childrens.push( currentHeading );
		} else {
			previousValue.push( currentHeading );
		}

		return previousValue;
	};

	var reduceLevels = function( list ) {
		list = list.reduce( majik, [] );

		var i;
		for ( i = 0; i < list.length; i += 1 ) {
			if ( ! list[ i ].childrens || ! list[ i ].childrens.length ) {
				continue;
			}

			list[ i ].childrens = reduceLevels( list[ i ].childrens );
		}

		return list;
	};

	var generateList = function( list, isFirstLevel ) {
		var $ul = $( '<ul></ul>' );
		$ul.addClass( 'level-' + list[ 0 ].level );

		if ( true === isFirstLevel ) {
			$ul.addClass( 'nav' );
		}

		var i, $li;
		for ( i = 0; i < list.length; i += 1 ) {
			$li = $( '<li></li>' );
			$li.append(
				'<a href="#' + list[ i ].$el.attr( 'id' ) + '" onclick="clickSingleA(this)">' +
					list[ i ].$el.text().replace( /^#\ /, '' ) +
				'</a>'
			);

			if (  list[ i ].level < 3 && list[ i ].childrens && list[ i ].childrens.length ) {
				$li.append( generateList( list[ i ].childrens ) );
				$li.addClass( 'has-submenu' );
			}

			$ul.append( $li );
		}

		return $ul;
	};

	if ( headings.length ) {
		headings = reduceLevels( headings );

		generateList( headings, true ).appendTo( '.js-sections' );
		var ghButtonHtml = "<a href='https://github.com/icons8/lunacy-docs' id='sections-button' class='btn btn--dark btn--rounded btn--w-icon btn--github js-affix'><i class='icon icon--github' style='float: left; margin-left: 0px; margin-right: 16px'></i>Suggest Edits</a>";
		var ghButton = $.parseHTML(ghButtonHtml);
		$('.js-sections').append(ghButton);
	}

	// Smooth anchor scrolling
	let $jsSmoothScroll = $( '.js-smooth-scroll' );

	$jsSmoothScroll.click( function() {
		$( 'html, body' ).animate( {
			scrollTop: $( $( this ).attr( 'href' ) ).offset().top
		}, 600 );

	} );

	$(".micro-nav-header ").click( function() {
		if( $('.micro-nav-header').hasClass("menu-disable") ) {
			$('.micro-nav-header').removeClass("menu-disable");
			$( '#micro-nav' ).slideDown(400)
		} else {
			$('.micro-nav-header').addClass("menu-disable");
			$( '#micro-nav' ).slideUp(400)
		}
	} );
	$(".micro-nav-header a").click( function(event){
		if( $('.micro-nav-header').hasClass("menu-disable") ) {
			event.preventDefault()
		}
	} );
	if (!document.querySelector('#micro-nav.release-note ')) {
		$('#micro-nav li.active > a').click(function () {
			event.preventDefault();
			$(this).next(".submenu").slideToggle();
		})
	} else {
		$('#micro-nav li > a').click(function (event){
			if($(this).parent('li').hasClass('active')) {
				event.preventDefault()
				$(this).next(".submenu").slideToggle();
			} else {
				$( 'html, body' ).animate( {
					scrollTop: $( $( this ).attr( 'href' ) ).offset().top
				}, 600 );
				$(this).next(".submenu").slideToggle();
				
			}
		})
	}
	
	if (document.documentElement.clientHeight - 80  <= document.getElementById('micro-nav').scrollHeight) {
		new SimpleBar(document.getElementById('micro-nav'))
	} else if (document.querySelector('#micro-nav.release-note ')) {
		new SimpleBar(document.getElementById('micro-nav'))
	}

	let MicroNavInit = function() {
		if ($(window).width() > 1199) {
			$( '#micro-nav' ).css({"width": $( '.col-lg-3' ).width() - 30});
			$( '#micro-nav' ).slideDown(0);
		} else {
			$( '#micro-nav' ).slideUp(0);
			$( '#micro-nav' ).css({"width": "100%"});
		}
	
		// Affix init
		if ($(window).width() > 1199) {
			$( '#micro-nav' ).affix( {
				offset: {
					top: function() {
						return (
							this.top = $( '#micro-nav' ).offset().top - $('.site-header').outerHeight() + 25
						);
					},
					bottom: function() {
						return (
							this.bottom = $( '.footer' ).outerHeight( true ) + 80
						);
					}
				}
			} );
		}
	};

	let activeLinkSubMenu; 
	let activeLinkMenu;
	let bufferActiveLinkMenu;
	$(document).ready(function() {
		MicroNavInit()
		if (!document.querySelector('#micro-nav.release-note ')) {
			activeLinkSubMenu = currentActiveLinkSubMenu(document.querySelectorAll("#content h3, #content h2:not(.content__title)"), 20)
		} else {
			activeLinkMenu =  currentActiveLinkSubMenu(document.querySelectorAll("#content h1"), 20)
			activeLinkSubMenu = currentActiveLinkSubMenu(document.querySelectorAll("#content h2:not(.content__title)"), 20)
		}
		if (activeLinkMenu) {
			document.querySelector("#micro-nav [href*='#" + activeLinkMenu.id + "']").closest("li").classList.add('active')
			let href = location.protocol + '//' + location.hostname + (location.port ? ":" + location.port : "") + document.location.pathname + "#" + activeLinkMenu.id;
			changeHrefOnScroll(href);
		}
		if (activeLinkSubMenu) {
			document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").closest("li").classList.add('active')
			let href = location.protocol + '//' + location.hostname + (location.port ? ":" + location.port : "") + document.location.pathname + "#" + activeLinkSubMenu.id;
			changeHrefOnScroll(href);
			document.querySelector(".js-subheader").innerText = document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").innerText
		}
		
	})
	$( window ).on( 'resize', MicroNavInit );
	$(window).on("scroll", function(e) {
		if (!document.querySelector('#micro-nav.release-note ') && document.querySelector(".submenu"))  {
			let item_submenu = document.querySelector(".submenu").querySelectorAll("li");
			for (let index = 0; index < item_submenu.length; index++) {
				const element = item_submenu[index];
				element.classList.remove('active')
			}
			activeLinkSubMenu = currentActiveLinkSubMenu(document.querySelectorAll("#content h3, #content h2:not(.content__title)"), 20)
			if (activeLinkSubMenu) {
				document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").closest("li").classList.add('active')
				let href = location.protocol + '//' + location.hostname + (location.port ? ":" + location.port : "") + document.location.pathname + "#" + activeLinkSubMenu.id;
				changeHrefOnScroll(href);
				document.querySelector(".js-subheader").innerText = document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").innerText
			}
		} else if (document.querySelector('#micro-nav.release-note ')) {
			let links = document.querySelectorAll('#micro-nav li');
			for (let index = 0; index < links.length; index++) {
				const element = links[index];
				element.classList.remove('active')
			}
			activeLinkMenu =  currentActiveLinkSubMenu(document.querySelectorAll("#content h1"), 20)
			activeLinkSubMenu = currentActiveLinkSubMenu(document.querySelectorAll("#content h2:not(.content__title)"), 20)
			if (activeLinkSubMenu) {
				document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").closest("li").classList.add('active')
				let href = location.protocol + '//' + location.hostname + (location.port ? ":" + location.port : "") + document.location.pathname + "#" + activeLinkSubMenu.id;
				changeHrefOnScroll(href);
				document.querySelector(".js-subheader").innerText = document.querySelector(".submenu [href*='#" + activeLinkSubMenu.id + "']").innerText
			}
			if (activeLinkMenu) {
				document.querySelector("#micro-nav [href*='#" + activeLinkMenu.id + "']").closest("li").classList.add('active')
			}
		}

	})


}( jQuery ) );

function createNavSubMenu() {
		let items = document.querySelectorAll("#content h3, #content h2:not(.content__title)");
		if (items.length < 2) {
			return "";
		}
		let array = []
		for (let index = 0; index < items.length; index++) {
			array.push( '<li><a href="#' + items[index].id + '" class="js-smooth-scroll">' + items[index].innerText + '</a></li>' )
		}
	
		return '<ul class="submenu">' + array.join('') + '</ul>';
}

function currentActiveLinkSubMenu(obj, offset_top = 0) {
	if (obj.length < 2) {
		return null
	}
	for (let index = 1; index < obj.length; index++) {
		const element = obj[index];
		let elemet_yx = element.getBoundingClientRect();
		if (index == 1 && obj[index - 1].getBoundingClientRect().top >= offset_top ) {
			return null;
		}
		if (index == obj.length - 1 && elemet_yx.top < offset_top ) {
			return element;
		}
		if( elemet_yx.top >= offset_top ) {
			return  obj[index - 1];
		}
	}
}

function createNavSubMenuReleaseNote(header) {
	let prevMainHeader;
	let nextMainHeader;
	let arr = [];
	for (let index = 0; index < header.length; index++) {
		const element = header[index];

		if (element.tagName == "H1" && !prevMainHeader) {
			prevMainHeader = element;
			continue
		}

		if (element.tagName == "H2") {
			arr.push( '<li><a href="#' + element.id + '" class="js-smooth-scroll">' + element.innerText + '</a></li>' )
			continue
		}
		if (element.tagName == "H1" || index == header.length - 1) {
			if (arr.length != 0) {
				document.querySelector("#micro-nav [href*='#" + prevMainHeader.id + "']").closest('li').innerHTML += '<ul class="submenu">' + arr.join('') + '</ul>';
				// $("#micro-nav [href*='#" + prevMainHeader.id + "']").next('.submenu').slideUp(0);
				arr.length = 0;
			}
			prevMainHeader = element;
			continue
		} 
	}
}

function getCurrentNavLink() {
	if(!document.querySelector(".micro-nav-header.page-menu") || document.querySelector('#micro-nav.release-note ')) {
		return false
	}
	let array = document.querySelectorAll("#micro-nav li a");
	
	for (let index = 0; index < array.length; index++) {
		const element = array[index];
		if (element.href == document.location.toString().split("/#")[0] || element.href + "/" == document.location) {
			return element
		}
	}
}

function changeHrefOnScroll(href) {
	let stateObj = { id: "100" };
	window.history.pushState(stateObj, "", href);
} 


function clickSingleA(a)
{
    items = document.querySelectorAll('a.active');

    if(items.length) 
    {
        items[0].className = '';
    }

    a.className = 'active';
}

function openModal()
{
	document.querySelector(".close-modal").style.display = "inline-block"
	document.querySelector(".burger-modal").style.display = "flex"
}

function closeModal()
{
	document.querySelector(".burger-modal").style.display = "none"
	document.querySelector(".close-modal").style.display = "none"
}
