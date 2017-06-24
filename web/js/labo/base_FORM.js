// jQuery Mask Plugin v1.13.4
// github.com/igorescobar/jQuery-Mask-Plugin
(function(b) {
    "function" === typeof define && define.amd ? define(["jquery"], b) : "object" === typeof exports ? module.exports = b(require("jquery")) : b(jQuery || Zepto)
})(function(b) {
    var y = function(a, c, d) {
        a = b(a);
        var g = this,
            k = a.val(),
            l;
        c = "function" === typeof c ? c(a.val(), void 0, a, d) : c;
        var e = {
            invalid: [],
            getCaret: function() {
                try {
                    var q, b = 0,
                        e = a.get(0),
                        f = document.selection,
                        c = e.selectionStart;
                    if (f && -1 === navigator.appVersion.indexOf("MSIE 10")) q = f.createRange(), q.moveStart("character", a.is("input") ? -a.val().length : -a.text().length),
                        b = q.text.length;
                    else if (c || "0" === c) b = c;
                    return b
                } catch (d) {}
            },
            setCaret: function(q) {
                try {
                    if (a.is(":focus")) {
                        var b, c = a.get(0);
                        c.setSelectionRange ? c.setSelectionRange(q, q) : c.createTextRange && (b = c.createTextRange(), b.collapse(!0), b.moveEnd("character", q), b.moveStart("character", q), b.select())
                    }
                } catch (f) {}
            },
            events: function() {
                a.on("input.mask keyup.mask", e.behaviour).on("paste.mask drop.mask", function() {
                    setTimeout(function() {
                        a.keydown().keyup()
                    }, 100)
                }).on("change.mask", function() {
                    a.data("changed", !0)
                }).on("blur.mask",
                    function() {
                        k === a.val() || a.data("changed") || a.triggerHandler("change");
                        a.data("changed", !1)
                    }).on("blur.mask", function() {
                    k = a.val()
                }).on("focus.mask", function(a) {
                    !0 === d.selectOnFocus && b(a.target).select()
                }).on("focusout.mask", function() {
                    d.clearIfNotMatch && !l.test(e.val()) && e.val("")
                })
            },
            getRegexMask: function() {
                for (var a = [], b, e, f, d, h = 0; h < c.length; h++)(b = g.translation[c.charAt(h)]) ? (e = b.pattern.toString().replace(/.{1}$|^.{1}/g, ""), f = b.optional, (b = b.recursive) ? (a.push(c.charAt(h)), d = {
                    digit: c.charAt(h),
                    pattern: e
                }) : a.push(f || b ? e + "?" : e)) : a.push(c.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                a = a.join("");
                d && (a = a.replace(new RegExp("(" + d.digit + "(.*" + d.digit + ")?)"), "($1)?").replace(new RegExp(d.digit, "g"), d.pattern));
                return new RegExp(a)
            },
            destroyEvents: function() {
                a.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))
            },
            val: function(b) {
                var c = a.is("input") ? "val" : "text";
                if (0 < arguments.length) {
                    if (a[c]() !== b) a[c](b);
                    c = a
                } else c = a[c]();
                return c
            },
            getMCharsBeforeCount: function(a,
                b) {
                for (var e = 0, f = 0, d = c.length; f < d && f < a; f++) g.translation[c.charAt(f)] || (a = b ? a + 1 : a, e++);
                return e
            },
            caretPos: function(a, b, d, f) {
                return g.translation[c.charAt(Math.min(a - 1, c.length - 1))] ? Math.min(a + d - b - f, d) : e.caretPos(a + 1, b, d, f)
            },
            behaviour: function(a) {
                a = a || window.event;
                e.invalid = [];
                var c = a.keyCode || a.which;
                if (-1 === b.inArray(c, g.byPassKeys)) {
                    var d = e.getCaret(),
                        f = e.val().length,
                        n = d < f,
                        h = e.getMasked(),
                        k = h.length,
                        m = e.getMCharsBeforeCount(k - 1) - e.getMCharsBeforeCount(f - 1);
                    e.val(h);
                    !n || 65 === c && a.ctrlKey || (8 !==
                        c && 46 !== c && (d = e.caretPos(d, f, k, m)), e.setCaret(d));
                    return e.callbacks(a)
                }
            },
            getMasked: function(a) {
                var b = [],
                    k = e.val(),
                    f = 0,
                    n = c.length,
                    h = 0,
                    l = k.length,
                    m = 1,
                    p = "push",
                    u = -1,
                    t, w;
                d.reverse ? (p = "unshift", m = -1, t = 0, f = n - 1, h = l - 1, w = function() {
                    return -1 < f && -1 < h
                }) : (t = n - 1, w = function() {
                    return f < n && h < l
                });
                for (; w();) {
                    var x = c.charAt(f),
                        v = k.charAt(h),
                        r = g.translation[x];
                    if (r) v.match(r.pattern) ? (b[p](v), r.recursive && (-1 === u ? u = f : f === t && (f = u - m), t === u && (f -= m)), f += m) : r.optional ? (f += m, h -= m) : r.fallback ? (b[p](r.fallback), f += m, h -= m) : e.invalid.push({
                        p: h,
                        v: v,
                        e: r.pattern
                    }), h += m;
                    else {
                        if (!a) b[p](x);
                        v === x && (h += m);
                        f += m
                    }
                }
                a = c.charAt(t);
                n !== l + 1 || g.translation[a] || b.push(a);
                return b.join("")
            },
            callbacks: function(b) {
                var g = e.val(),
                    l = g !== k,
                    f = [g, b, a, d],
                    n = function(a, b, c) {
                        "function" === typeof d[a] && b && d[a].apply(this, c)
                    };
                n("onChange", !0 === l, f);
                n("onKeyPress", !0 === l, f);
                n("onComplete", g.length === c.length, f);
                n("onInvalid", 0 < e.invalid.length, [g, b, a, e.invalid, d])
            }
        };
        g.mask = c;
        g.options = d;
        g.remove = function() {
            var b = e.getCaret();
            e.destroyEvents();
            e.val(g.getCleanVal());
            e.setCaret(b -
                e.getMCharsBeforeCount(b));
            return a
        };
        g.getCleanVal = function() {
            return e.getMasked(!0)
        };
        g.init = function(c) {
            c = c || !1;
            d = d || {};
            g.byPassKeys = b.jMaskGlobals.byPassKeys;
            g.translation = b.jMaskGlobals.translation;
            g.translation = b.extend({}, g.translation, d.translation);
            g = b.extend(!0, {}, g, d);
            l = e.getRegexMask();
            !1 === c ? (d.placeholder && a.attr("placeholder", d.placeholder), b("input").length && !1 === "oninput" in b("input")[0] && "on" === a.attr("autocomplete") && a.attr("autocomplete", "off"), e.destroyEvents(), e.events(), c = e.getCaret(),
                e.val(e.getMasked()), e.setCaret(c + e.getMCharsBeforeCount(c, !0))) : (e.events(), e.val(e.getMasked()))
        };
        g.init(!a.is("input"))
    };
    b.maskWatchers = {};
    var A = function() {
            var a = b(this),
                c = {},
                d = a.attr("data-mask");
            a.attr("data-mask-reverse") && (c.reverse = !0);
            a.attr("data-mask-clearifnotmatch") && (c.clearIfNotMatch = !0);
            "true" === a.attr("data-mask-selectonfocus") && (c.selectOnFocus = !0);
            if (z(a, d, c)) return a.data("mask", new y(this, d, c))
        },
        z = function(a, c, d) {
            d = d || {};
            var g = b(a).data("mask"),
                k = JSON.stringify;
            a = b(a).val() ||
                b(a).text();
            try {
                return "function" === typeof c && (c = c(a)), "object" !== typeof g || k(g.options) !== k(d) || g.mask !== c
            } catch (l) {}
        };
    b.fn.mask = function(a, c) {
        c = c || {};
        var d = this.selector,
            g = b.jMaskGlobals,
            k = b.jMaskGlobals.watchInterval,
            l = function() {
                if (z(this, a, c)) return b(this).data("mask", new y(this, a, c))
            };
        b(this).each(l);
        d && "" !== d && g.watchInputs && (clearInterval(b.maskWatchers[d]), b.maskWatchers[d] = setInterval(function() {
            b(document).find(d).each(l)
        }, k));
        return this
    };
    b.fn.unmask = function() {
        clearInterval(b.maskWatchers[this.selector]);
        delete b.maskWatchers[this.selector];
        return this.each(function() {
            var a = b(this).data("mask");
            a && a.remove().removeData("mask")
        })
    };
    b.fn.cleanVal = function() {
        return this.data("mask").getCleanVal()
    };
    b.applyDataMask = function(a) {
        a = a || b.jMaskGlobals.maskElements;
        (a instanceof b ? a : b(a)).filter(b.jMaskGlobals.dataMaskAttr).each(A)
    };
    var p = {
        maskElements: "input,td,span,div",
        dataMaskAttr: "*[data-mask]",
        dataMask: !0,
        watchInterval: 300,
        watchInputs: !0,
        watchDataMask: !1,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            0: {
                pattern: /\d/
            },
            9: {
                pattern: /\d/,
                optional: !0
            },
            "#": {
                pattern: /\d/,
                recursive: !0
            },
            A: {
                pattern: /[a-zA-Z0-9]/
            },
            S: {
                pattern: /[a-zA-Z]/
            }
        }
    };
    b.jMaskGlobals = b.jMaskGlobals || {};
    p = b.jMaskGlobals = b.extend(!0, {}, p, b.jMaskGlobals);
    p.dataMask && b.applyDataMask();
    setInterval(function() {
        b.jMaskGlobals.watchDataMask && b.applyDataMask()
    }, p.watchInterval)
});
jQuery(document).ready(function($) {

	var errorMessages = new Array();
	var hiddenBalise = 'hiddendata';
	// environnement (dev/prod/test)environnementMode
	if($('#'+hiddenBalise+' #environnementMode').length) {
		var environnementMode = $('#'+hiddenBalise+' #environnementMode').text();
		$('body').data('environnementMode', environnementMode);
	} else {
		alert("Erreur majeure : environnement non défini.");
		errorMessages.push("Erreur : environnement non défini.");
	}
	var locale = $('#'+hiddenBalise+' #locale').text();
	if(environnementMode != 'prod') console.log("Locale : ", locale);


	/***************************************/
	/* initialisation ICHECK/IRADIO        */
	/***************************************/
	// initialisation SWITCHERY 
	// http://abpetkov.github.io/switchery/

	$('.js-switch').each(function (item) {
		var switchButton = new Switchery(this, { color: '#a3401b', size: 'small' });
	});

	/***************************************/
	/* initialisation data-report          */
	/***************************************/
	$('.data-report').each(function (item) {
		var dr_target = $(this).attr('data-report-target');
		var $parent = $(this);
		if(dr_target != undefined) {
			var target = $(dr_target);
			if(target != undefined) {
				$parent.text(target.val());
				$(target).on('keyup change', function (elem) {
					$parent.text(target.val());
				});
			}
		}
	});


	/***************************************/
	/* Tableau tarif options               */
	/***************************************/

	var normalizeFloat = function(value) {
	    var neg = value[0] == '-';
	    value = value.replace(/(,)/g, ".");
	    var res = parseFloat(value.replace(/([^\d,\.])/g, ""));
	    if(isNaN(res)) res = 0;
	    return neg ? 0 - res : res;
	}
	var normalizeInteger = function(value) {
	    var neg = value[0] == '-';
	    value = value.split(/([,\.])/g);
	    var res = parseInt(value[0].replace(/([^\d])/g, ""));
	    if(isNaN(res)) res = 0;
	    return neg ? 0 - res : res;
	}
	var textareaData = function($elem, data) {
		var $textarea = $elem.closest('div.tarifoptions-block').find('textarea.formdata:first');
		// console.error('textarea not found with:', {elem: $elem, textarea: $textarea, text: $textarea.text()});
		if(data === undefined) {
			return $.parseJSON($textarea.text());
		} else {
			$textarea.text(JSON.stringify(data));
		}
	}

	var controlValue = function(type, value) {
		value = $('<div>'+value+'</div>').text();
		switch(type) {
			case 'percent':
				value = normalizeFloat(value)+'%';
				break;
			case 'money':
				value = normalizeInteger(value)+'€';
				break;
			case 'boolean':
				value = value == true || value == 'true' || value > 0 || value == "1";
				break;
			case 'string':
				// value = strip_tags(value);
				break;
			case 'integer':
				value = normalizeInteger(value);
				break;
			case 'float':
				value = normalizeFloat(value);
				break;
		}
		return value;
	}
	var focusInputText = function($elem) {
		if($elem.data('backgroundColor') === undefined) $elem.data('backgroundColor', $elem.css('backgroundColor'));
		if($elem.data('padding') === undefined) $elem.data('padding', $elem.css('padding'));
		$elem.css('backgroundColor', '#666').css('padding', '6px 0px 0px 0px');
		$elem.removeClass('top-input-text').addClass('top-input-text-focused');
		text = $elem.text();
		$elem.data('text', text);
		$input = $('<input type="text" value="'+text+'" style="width: 90%; text-align: center; margin: 0px;">');
		$elem.text('').append($input);
		$input.focus();
		$input.on( "keyup", function (event) { unFocusInputText(event); });
		$input.on( "focusout", function (event) { unFocusInputText(event); });
	}
	var unFocusInputText = function(event) {
		// console.log("Focus out event:", event);
		var do_it = null;
		switch(event.type) {
			case 'keyup':
				if(event.keyCode === $.ui.keyCode.ESCAPE) do_it = false; // #27 : ESC
				if(event.keyCode === $.ui.keyCode.ENTER) do_it = true; // #13 : ENTER
				break;
			case 'focusout':
				do_it = true;
				break;
		}
		var $elem = $(event.currentTarget).parent();
		var datatype = $elem.attr('data-type');
		switch(do_it) {
			case true:
				$elem.css('backgroundColor', $elem.data('backgroundColor'));
				$elem.css('padding', $elem.data('padding'));
				newtext = controlValue(datatype, $elem.find('input').first().val());
				var textarea_data = textareaData($elem);
				eval('textarea_data'+$elem.attr('data-placement')+' = "'+newtext+'"');
				textareaData($elem, textarea_data);
				$elem.empty();
				$elem.text(newtext);
				$elem.removeClass('top-input-text-focused').addClass('top-input-text');
				break;
			case false:
				$elem.css('backgroundColor', $elem.data('backgroundColor'));
				$elem.css('padding', $elem.data('padding'));
				$elem.empty();
				$elem.text($elem.data('text'));
				$elem.removeClass('top-input-text-focused').addClass('top-input-text');
				break;
			default:
				break;
		}
	}

	$('.top-input-text').on('click', function (event) {
		focusInputText($(this));
	});

	$('input').on('ifChanged', function (event) {
		// var $elem = $(event.currentTarget).parent();
		var datatype = $(this).attr('data-type');
		newval = controlValue(datatype, event.currentTarget.checked);
		console.log("Checkbox event:", {event: event, item: this, checked: event.currentTarget.checked+'/'+newval, type: datatype});
		var textarea_data = textareaData($(this));
		eval('textarea_data'+$(this).attr('data-placement')+' = '+newval);
		textareaData($(this), textarea_data);
	});


	/***************************************/
	/* initialisation ICHECK/IRADIO        */
	/***************************************/
	$('.icheckbox, .iradio').each(function() {
		$(this).iCheck({
			checkboxClass: 'icheckbox_square-green',
			radioClass: 'iradio_square-green',
			// increaseArea: '20%' // optional
		});
	});

	/***************************************/
	/* initialisation DATEPICKER           */
	/***************************************/
	$('.input-group.date').datepicker({
		todayBtn: "linked",
		keyboardNavigation: false,
		forceParse: false,
		calendarWeeks: true,
		autoclose: true,
		format: $('#formFormatDate').text(),
	});

	/***************************************/
	/* initialisation COLORPICKER          */
	/***************************************/
	$('.colorpickers').each(function(e) {
		// var picker = $('>input', this).first();
		$(this).colorpicker({
			// horizontal: true,
			format: 'rgba',
		});
	});

	/***************************************/
	/* initialisation RICHTEXT             */
	/***************************************/
	/* initialisation RICHTEXT */
	$('.richtexts').each(function (item) {
		var $parent = $(this);
		var height = 140;
		if($(this).attr('data-height') != undefined) {
			height = parseInt($(this).attr('data-height'));
		}	
		$(this).summernote({
		// $('.richtexts').summernote({
			// options…
			lang: 'fr',
			height: height,
			// minHeight: height + 16,
			focus: false,
			// airMode: true,
			toolbar: [
					//[groupname, [button list]]
					["style", ["style"]],
					["font", ["bold", "italic", "underline", "clear"]],
					["fontname", ["fontname"]],
					["color", ["color"]],
					["para", ["ul", "ol", "paragraph"]],
					// ["height", ["height"]],
					["table", ["table"]],
			        ["insert", ["link", "picture", "video"]],
	                // ["view", ["fullscreen", "codeview"]],
			        ["view", ["codeview"]],
					["help", ["help"]]
				]
		});
	});

	/***************************************/
	/* initialisation POPOVER              */
	/***************************************/
	$('body [data-toggle="popover"]').popover({
		// options…
	});

	/***************************************/
	/* initialisation TOOLTIP              */
	/***************************************/
	$('body [data-toggle="tooltip"]').tooltip({
		container: 'body',
		delay: { "show": 500, "hide": 100 },
	});

	/***************************************/
	/* fonctionnalités data-mask           */
	/***************************************/
	// $('body .input-group.mask >input[class^=mask-]').each(function (e) {
	// 	var parenthis = this;
	// 	var parent = $(this).parent();
	// 	var index = e;
	// 	var addon = $(parent).find('> .input-group-addon').first();

	// 	if($(this).hasClass('mask-money')) {
	// 		$(parent).data('format', "# ##0,00");
	// 		$(parent).data('params', {'placeholder': "0,00", 'reverse': "true", 'data-mask-clearifnotmatch': "true"});
	// 	} else if($(this).hasClass('mask-tel')) {
	// 		$(parent).data('format', "00 00 00 00 00");
	// 		$(parent).data('params', {'placeholder': "Téléphone", 'data-mask-clearifnotmatch': "true"});
	// 	} else if($(this).hasClass('mask-cp')) {
	// 		$(parent).data('format', "00000");
	// 		$(parent).data('params', {'placeholder': "Code postal", 'data-mask-clearifnotmatch': "true"});
	// 	} else if($(this).hasClass('mask-dept')) {
	// 		$(parent).data('format', "00");
	// 		$(parent).data('params', {'placeholder': "Département", 'data-mask-clearifnotmatch': "true"});
	// 	} else if($(this).hasClass('mask-siret')) {
	// 		$(parent).data('format', "000000000-00000");
	// 		$(parent).data('params', {'placeholder': "Siret (9+5 chiffres)", 'data-mask-clearifnotmatch': "true"});
	// 	} else if($(this).hasClass('mask-siren')) {
	// 		$(parent).data('format', "000000000");
	// 		$(parent).data('params', {'placeholder': "Siren (9 chiffres)", 'data-mask-clearifnotmatch': "true"});
	// 	} else return false;
	// 	// $(addon).data('data-mask-index', index);
	// 	// alert(index);
	// 	// $(this).attr('title', 'Index : '+index);
	// 	$(this).mask($(parent).data('format'), $(parent).data('params'));
	// 	$(parent).data('data-mask-switch', true);
	// 	// évènements
	// 	$(addon).on('click', function (e) {
	// 		// alert($(e).attr('class')+"/"+$(e).attr('id'));
	// 		if($(parent).data('data-mask-switch') == false) {
	// 			$(parent).data('data-mask-switch', true);
	// 			$(this, '>i.fa').removeClass('text-danger');
	// 			$(parenthis).mask($(parent).data('format'), $(parent).data('params'));
	// 		} else {
	// 			$(parent).data('data-mask-switch', false);
	// 			$(this, '>i.fa').addClass('text-danger');
	// 			$(parenthis).unmask().attr('placeholder', null);
	// 		}
	// 	});
	// });


	/***************************************/
	/* Sortable / Nested                   */
	/***************************************/

	// if($('.master-nestable-menu').length) {
	// 	// https://github.com/dbushell/Nestable/issues/77
	// 	// https://github.com/dbushell/Nestable
	// 	// http://dbushell.github.io/Nestable/
	// 	$('.master-nestable-menu').each(function (e) {
	// 		var idnest = $(this).attr('id');
	// 		if(environnementMode != 'prod') console.log("New nestable : ", idnest);

	// 		var infoRoles = $.parseJSON($('[data-info-roles]', this).first().attr('data-info-roles'));
	// 		var pwebs = $.parseJSON($('[data-info-pagewebs]', this).first().attr('data-info-pagewebs'));
	// 		var messages = $.parseJSON($('[data-info-messages]', this).first().attr('data-info-messages'));
	// 		// if(environnementMode != 'prod') console.log("Roles : ", window.JSON.stringify(infoRoles));
	// 		// if(environnementMode != 'prod') console.log("Pagewebs : ", window.JSON.stringify(pwebs));
	// 		if(environnementMode != 'prod') console.log("Messages : ", window.JSON.stringify(messages));
	// 		var $parent = $(this);
	// 		var bundle = $(this).attr('data-bundle');
	// 		var name = $(this).attr('data-name');
	// 		var maxDepth = parseInt($(this).attr('data-maxDepth'));
	// 		var url = $(this).attr('data-url');

	// 		$('div.dd3-content', this).first().css('background-color', "#ddd;");

	// 		$(this).nestable({
	// 			group: idnest,
	// 			maxDepth: maxDepth,
	// 		}).on('change', function() {
	// 			$.ajax({
	// 				url: url,
	// 				method: "POST",
	// 				data: {tree: $parent.nestable('serialize')},
	// 			});
	// 		});

	// 		// get data of item
	// 		var getDataOfItem = function(idnest, id) {
	// 			var $target = $('div#' + idnest + ' li#li-' + idnest + "-" + id);
	// 			data = $target.attr('data-item');
	// 			return $.parseJSON(data);
	// 		}

	// 		// set data of item
	// 		var setDataOfItem = function(idnest, id, champ, data) {
	// 			var $target = $('div#' + idnest + ' li#li-' + idnest + "-" + id);
	// 			// change id
	// 			switch(champ) {
	// 				case 'name':
	// 					$('.dd3-content > span.text', $target).first().text(data.name);
	// 					if(messages.hasOwnProperty(data.name) == true) data.name = messages[data.name];
	// 					break;
	// 				case 'pageweb':
	// 					$('.dd3-content .pageweb', $target).first().text(pwebs[data.path.params.pageweb]);
	// 					break;
	// 				case 'role':
	// 					$('.dd3-content > span > small', $target).first().text(infoRoles[data.role]);
	// 					break;
	// 				case 'icon':
	// 					$elem = $('.dd3-content > i.fa', $target).first();
	// 					icon = $elem.attr('data-fa');
	// 					$elem.removeClass(icon);
	// 					$elem.attr('data-fa', data.icon);
	// 					$elem.addClass(data.icon);
	// 					break;
	// 			}
	// 			$target.attr('data-item', window.JSON.stringify(data));
	// 		}

	// 		// change name
	// 		$('body').on('change', 'input.name', function (e) {
	// 			var idnest = $(this).attr('data-idnest');
	// 			var id = $(this).attr('data-id');
	// 			var data = getDataOfItem(idnest, id);
	// 			data.name = $(this).val();
	// 			setDataOfItem(idnest, id, 'name', data);
	// 			$.ajax({
	// 				url: url,
	// 				method: "POST",
	// 				data: {tree: $parent.nestable('serialize')},
	// 			}).complete(function() {
	// 				// if(environnementMode != 'prod') console.log('Back change name : \n', window.JSON.stringify(data));
	// 			});
	// 		});

	// 		// change pageweb
	// 		// $('body').on('change', 'select.pageweb', function() { alert($(this).val() + " = " + $(this).text()); });
	// 		$('body').on('change', 'select.pageweb', function (e) {
	// 			$(this).trigger("chosen:updated");
	// 			var idnest = $(this).attr('data-idnest');
	// 			var id = $(this).attr('data-id');
	// 			var data = getDataOfItem(idnest, id);
	// 			data.path.params.pageweb = $(this).val();
	// 			// var newpageweb = $("select.pageweb").first().children("option").filter(":selected").text();
	// 			setDataOfItem(idnest, id, 'pageweb', data);
	// 			$.ajax({
	// 				url: url,
	// 				method: "POST",
	// 				data: {tree: $parent.nestable('serialize')},
	// 			}).complete(function() {
	// 				// if(environnementMode != 'prod') console.log('Back change pageweb : ' + newpageweb);
	// 			});
	// 		});

	// 		// change role
	// 		// $('body').on('change', 'select.role', function() { alert($(this).val() + " = " + $(this).text()); });
	// 		$('body').on('change', 'select.role', function (e) {
	// 			$(this).trigger("chosen:updated");
	// 			var idnest = $(this).attr('data-idnest');
	// 			var id = $(this).attr('data-id');
	// 			var data = getDataOfItem(idnest, id);
	// 			data.role = $(this).val();
	// 			// var newrole = $("select.role").first().children("option").filter(":selected").text();
	// 			setDataOfItem(idnest, id, 'role', data);
	// 			$.ajax({
	// 				url: url,
	// 				method: "POST",
	// 				data: {tree: $parent.nestable('serialize')},
	// 			}).complete(function() {
	// 				// if(environnementMode != 'prod') console.log('Back change role : ' + newrole);
	// 			});
	// 		});

	// 		// change icon
	// 		$('body').on('click', 'button.icon', function (e) {
	// 			$('button.icon', $(this).parent()).removeClass('btn-primary').addClass('btn-white');
	// 			$(this).toggleClass('btn-white').toggleClass('btn-primary');
	// 			var icon = $('>i.fa', this).first().attr('data-fa');
	// 			var $big = $('div.well >i.fa', $(this).parent().parent()).first();
	// 			var oldicon = $big.attr('data-fa');
	// 			$big.removeClass(oldicon).addClass(icon).attr('data-fa', icon);
	// 			var idnest = $(this).attr('data-idnest');
	// 			var id = $(this).attr('data-id');
	// 			var data = getDataOfItem(idnest, id);
	// 			data.icon = icon;
	// 			setDataOfItem(idnest, id, 'icon', data);
	// 			$.ajax({
	// 				url: url,
	// 				method: "POST",
	// 				data: {tree: $parent.nestable('serialize')},
	// 			}).complete(function() {
	// 				// if(environnementMode != 'prod') console.log('Back change role : ' + newrole);
	// 			});
	// 		});


	// 	});


	// 	/**
	// 	 * Actions sur nestables
	// 	 */
	// 	$('body').on('click', '.nest-menu button', function (e) {
	// 		switch($(this).attr('data-action')) {
	// 			case 'add':
	// 				idnest = $(this).attr('data-idnest');
	// 				alert('Ajouter un nouvel item ' + idnest);
	// 				$newil = $($('<ol class="dd-list bis">')).prepend($('<li class="dd-item bis">').prepend($('<div class="dd-handle bis">')));
	// 				$(idnest).prepend($newil);
	// 				break;
	// 			default:
	// 				$($(this).attr('data-idnest')).nestable($(this).attr('data-action'));
	// 		}
	// 	});

	// 	// icons
	// 	$('.menu-icons-item').hide();
	// 	$('.menu-icons-item').first().show();
	// 	// params
	// 	$('.menu-params-item').hide();
	// 	$('.menu-params-item').first().show();
	// 	$('body').on('mouseenter', 'div.dd div.dd3-content', function (e) {
	// 		var target = $(this).first().attr('data-toggle');
	// 		var master = "#"+$(this).first().attr('data-id');
	// 		$(master + ' div.dd3-content').css('background-color', "#fff;");
	// 		$(this).css('background-color', "#ddd;");
	// 		$('.menu-params-item').hide();
	// 		$('.menu-icons-item').hide();
	// 		$(target+'-param').show();
	// 		$(target+'-icon').show();
	// 	});

	// 	// http://refreshless.com/nouislider/
	// 	$(".depthSlider").each(function() {
	// 		var $parent = $(this);
	// 		var majtarget = $($(this).attr('data-maj-target'));
	// 		var idnest = $(this).attr('data-idnest');
	// 		noUiSlider.create($(this).get(0), {
	// 			start: parseInt($(this).attr('data-steps')),
	// 			behaviour: 'tap',
	// 			connect: 'upper',
	// 			animate: true,
	// 			// tooltips: true,
	// 			step: 1,
	// 			range: {
	// 				'min': 1,
	// 				'max': 6,
	// 			},
	// 			direction: 'ltr',
	// 			pips: { // Show a scale with the slider
	// 				mode: 'steps',
	// 				density: 20,
	// 			},
	// 		}).on('change', function() {
	// 			var parent = this;
	// 			var value = parseInt(this.get());
	// 			parent.set(value);
	// 			majtarget.text(value);
	// 			var url = $parent.attr('data-url').replace('%23%23%23value%23%23%23', value);
	// 			$.ajax({
	// 				url: url,
	// 				method: "GET",
	// 			}).complete(function(data) {
	// 				// data = $.parseJSON(data);
	// 				// data = window.JSON.stringify(data);
	// 				// alert(data.responseJSON.value);
	// 				newvalue = parseInt(data.responseJSON.value);
	// 				parent.set(newvalue);
	// 				majtarget.text(newvalue);
	// 				// actualisation…
	// 				$("#"+idnest).nestable({
	// 					group: idnest,
	// 					maxDepth: newvalue,
	// 				}).trigger('change');
	// 			});
	// 		});
	// 	});

	// }



	/***************************************/
	/* initialisation SELECT2              */
	/***************************************/
	var formatState = function (state) {
		if (!state.id) { return state.text; };
		var $state = $('<i class="fa fa-'+state.text+' fa-2x m-r-sm"></i><span>'+state.text+'</span>');
		return $state;
	}

	$('.select2').each(function (item) {
		var options = new Array();
		// placeholder
		if($(this).attr('placeholder') != undefined) placeholder = $(this).attr('placeholder');
			else placeholder = '…';
		options['placeholder'] = {id: "", placeholder: placeholder}
		// allowClear
		if($(this).attr('data-allowClear')) options['allowClear'] = eval($(this).attr('data-allowClear'));
		// max selection
		if($(this).attr('data-limit')) {
			limit = parseInt($(this).attr('data-limit'));
			if(limit > 0) options['maximumSelectionLength'] = limit;
		}
		// language
		if(locale != undefined) options['language'] = locale;
		if($(this).attr('data-language')) options['language'] = parseInt($(this).attr('data-language'));
		// templatisation
		if($(this).attr('data-format')) {
			options['templateResult'] = eval($(this).attr('data-format'));
		}
		// console log DEV
		if(environnementMode != 'prod') console.log("options : ", options);
		// initialize select2 with sortable
		// $(this).select2Sortable(options);
		$(this).select2(options);
	});

	/***************************************/
	/* initialisation CHOSEN               */
	/***************************************/
	// var config = {
	// 	'.chosen-select'           	: {},
	// 	'.chosen-select-deselect'  	: {allow_single_deselect:true},
	// 	'.chosen-select-no-single' 	: {disable_search_threshold:5},
	// 	'.chosen-select-no-results'	: {no_results_text:'Aucun résultat…'},
	// 	'.chosen-select-width'     	: {width:"95%"},
	// 	'.chosen-select-max1'      	: {max_selected_options:1},
	// 	'.chosen-required'			: {allow_single_deselect:false},
	// }
	// for (var selector in config) {
	// 	$(selector).chosen(config[selector]);
	// }

	// $('.chosen-multi-max1').chosen({
	// 	allow_single_deselect:		true,
	// 	disable_search_threshold:	5,
	// 	no_results_text:			'Aucun résultat…',
	// 	width:						"95%",
	// 	max_selected_options:		1
	// });

	// $('body .chosen-container').css({width: '100%'});
	// $('select').chosen({width: '100%'});
	// $('body').on('click', 'a[data-toggle="tab"]', function(elem) {
	// 	// cible = $(this).attr('href');
	// 	// alert(cible);
	// 	$('body ' + $(this).attr('href') + ' .chosen-container').css({width: '100%'});
	// });

	/***************************************/
	/* initialisation MULTIFORM            */
	/***************************************/
	// $("[id^=multi-form_].multi-form").each(function(elem) {
	// 	var elem = elem;
	// 	var colorActive = "success";
	// 	var basename = $(this).attr('id').replace(/^multi-form_/gi, '');
	// 	var name = basename+"_"+elem;
	// 	var tablename = "table_"+name;
	// 	var basedelete = "delete_"+basename+"_";
	// 	var deletename = basedelete+elem;
	// 	// prototype du tableau
	// 	var $tab_prototype = $($(this).attr('data-table-prototype')).attr('id', tablename);
	// 	// conteneur ul du formulaire imbriqué
	// 	var $ul_list_form = $('#'+$(this).attr('id')+' > ul.multi-form-ul').first();
	// 	// colonnes à afficher dans le tableau
	// 	// var cols = [0, 1, 2, 3];
	// 	var exp = new RegExp("[ ,;:|]+", "g");
	// 	var cols = $ul_list_form.attr('data-columns').split(exp);
	// 	// index débutant après la dernière ligne présente (pour edit)
	// 	var formIndex = $ul_list_form.find(' > li').length;
	// 	// prototype du formulaire imbriqué
	// 	var multi_form_prototype = $ul_list_form.attr("data-prototype");
	// 	// bouton(s) d'ajout d'une ligne de formulaire
	// 	var $addMultiFormLink = $('.add_multiform_link[data-target=#'+$(this).attr('id')+']');

	// 	/**
	// 	 * Renvoie le texte label d'une colonne du prototype (commence par 0)
	// 	 * @return string
	// 	 */
	// 	var getLabel_InPrototype = function(col) {
	// 		if(col == undefined) { alert("Erreur programme : col doit être défini !"); return false; }
	// 		var col = col;
	// 		return $(multi_form_prototype).find('.form-group:eq('+col+') > label').first().text().replace('*', '');
	// 	}

	// 	/**
	// 	 * Initialise et affiche l'en-tête du tableau
	// 	 */
	// 	var initiateHeader = function() {
	// 		var deleteColumn = "<th></th>";
	// 		$tab_prototype.find('> thead > tr').append(deleteColumn);
	// 		for (var i = 0; i <= cols.length - 1; i++) {
	// 			$tab_prototype.find('> thead > tr').append("<th class='ellipsis'>"+getLabel_InPrototype(cols[i])+"</th>");
	// 		}
	// 	}

	// 	/**
	// 	 * Vide les lignes du tableau
	// 	 */
	// 	var emptyArrayBody = function() {
	// 		$tab_prototype.find(' > tbody').first().empty();
	// 	}

	// 	/**
	// 	 * Renvoie la valeur de la colonne d'un index d'un sous-formulaire (index et col commencent par 0). 
	// 	 * Renvoie "" si rien n'est trouvé
	// 	 * @param integer index
	// 	 * @param integer col
	// 	 * @param boolean onlyOneIfSelect
	// 	 * @return sting
	// 	 */
	// 	var getTextValue = function(index, col, onlyOneIfSelect) {
	// 		if(index == undefined) { alert("Erreur programme : index doit être défini !"); return false; }
	// 		var index = index;
	// 		if(col == undefined) { alert("Erreur programme : col doit être défini !"); return false; }
	// 		var col = col;
	// 		if(onlyOneIfSelect == undefined) onlyOneIfSelect = false;
	// 		var onlyOneIfSelect = onlyOneIfSelect;
	// 		var reponse = undefined;
	// 		var balise = $ul_list_form.find(" > li:eq("+index+") > div .form-group:eq("+col+") input").first();
	// 		if(balise.length) {
	// 			// INPUT
	// 			if($(balise).attr('type') == 'text') {
	// 				// text
	// 				reponse = $(balise).val();
	// 			}
	// 		}
	// 		if(reponse == undefined) {
	// 			// pas d'input => on recherche un SELECT
	// 			balise = $ul_list_form.find(" > li:eq("+index+") > div .form-group:eq("+col+") select").first();
	// 			if(balise.length) {
	// 				// si onlyOneIfSelect == true
	// 				if(onlyOneIfSelect == true) reponse = $(balise).find("option:selected").first().text();
	// 					else {
	// 						var selects = $(balise).find("option:selected");
	// 						if(selects.length > 0) {
	// 							var texts = new Array();
	// 							for (var i = 0; i <= selects.length - 1; i++) {
	// 								texts.push($(selects[i]).text());
	// 							};
	// 							reponse = texts.join('<br>');
	// 						}
	// 					}
	// 			}
	// 		}
	// 		if(reponse == undefined) reponse = "";
	// 		return reponse;
	// 	}

	// 	/**
	// 	 * Renvoie une ligne html pour le tableau (avec "<td>") (index commence par 0). 
	// 	 * @param integer index
	// 	 * @return sting
	// 	 */
	// 	var getTdLineForArray = function(index) {
	// 		if(index == undefined) { alert("Erreur programme : index doit être défini !"); return false; }
	// 		var index = index;
	// 		var buffer = "";
	// 		for (var i = 0; i <= cols.length - 1; i++) {
	// 			buffer += "<td class='change_item in_cols ellipsis' style='cursor:pointer;'>"+getTextValue(index, cols[i])+"</td>";
	// 		};
	// 		return buffer;
	// 	}

	// 	var fillArray = function() {
	// 		var deleteColumn = "";
	// 		var $tbody = $tab_prototype.find(' > tbody').first();
	// 		// lignes du formulaire
	// 		var items = $ul_list_form.find(' > li');
	// 		// vide le tableau… au cas où…
	// 		emptyArrayBody();
	// 		if(items.length > 0) {
	// 			// puis le remplit…
	// 			var highlight = "";
	// 			for (var i = 0; i <= items.length - 1; i++) {
	// 				deleteColumn = "<td class='text-center delete_column' data-confirm-title='Confirmation' data-confirm-message='Souhaitez-vous supprimer cette ligne ?' title='Supprimer cette ligne' style='width: 36px;'><button id='"+deletename+"_"+i+"' class='btn btn-xs btn-danger btn-outline' data-item='"+i+"'><i class='fa fa-times'></i></button></td>";
	// 				if($(items[i]).css('display') != 'none') highlight = " "+colorActive;
	// 					else highlight = "";
	// 				$tbody.append("<tr class='ellipsis"+highlight+"'>"+deleteColumn+getTdLineForArray(i)+"</tr>")
	// 			}
	// 		}
	// 	}

	// 	/**
	// 	* Renvoie le nombre de sous-formulaires
	// 	* @return integer
	// 	*/
	// 	var getNumerOfSubforms = function() {
	// 		 return $ul_list_form.find(' > li').length;
	// 	 }

	// 	 var getIndexOfActiveItem = function() {
	// 		return $("#"+tablename+" > tbody > tr."+colorActive).index("#"+tablename+" > tbody > tr");
	// 	 }

	// 	var showSubformItem = function(item) {
	// 		$ul_list_form.find(' > li').hide();
	// 		if(item == undefined || item >= (getNumerOfSubforms()) || item < 0 || item == 'first') {
	// 			// Affiche le premier élément…
	// 			$ul_list_form.find(' > li').first().show();
	// 		} else if(item == 'last') {
	// 			// Affiche le nouvel (dernier, donc) élément…
	// 			$ul_list_form.find(' > li').last().show();
	// 		} else {
	// 			// item précis, on l'affiche…
	// 			$ul_list_form.find(' > li:eq('+item+')').show();
	// 		}
	// 		fillArray();
	// 	}

	// 	var addTagForm = function() {
	// 		$newLi = $('<li></li>').append(multi_form_prototype.replace(/__name__/gi, formIndex++));
	// 		$ul_list_form.append($newLi);
	// 		showSubformItem('last');
	// 		// fillArray();
	// 	}

	// 	var deleteItem = function(item) {
	// 		var active = false;
	// 		if(item == getIndexOfActiveItem()) active = true;
	// 		// efface le formulaire
	// 		$ul_list_form.find(' > li:eq('+item+')').remove();
	// 		// puis rafraîchit le tableau
	// 		if(active) showSubformItem(item - 1);
	// 			else fillArray();
	// 	}

	// 	/**
	// 	 * Renvoie l'index et la colonne de l'élément (dans le formulaire)
	// 	 * @param object elem
	// 	 * @return Array
	// 	 */
	// 	var getIndexAndCol_inForm = function(elem) {
	// 		if(elem == undefined) { alert("Erreur programme : elem doit être défini !"); return false; }
	// 		var elem = elem;
	// 		// index
	// 		var li = $(elem).closest('li');
	// 		var liparent = $(li).parent();
	// 		var index = $(li).index('#'+$(liparent).attr('id')+' > li');
	// 		// col
	// 		var div = $(elem).closest('.form-group');
	// 		var divparent = $(div).parent();
	// 		var col = $(div).index('#'+$(divparent).attr('id')+' > .form-group');
	// 		return {'index': index, 'col': col};
	// 	}

	// 	/**
	// 	 * Renvoie l'index et la colonne de l'élément (dans le tableau)
	// 	 * Attention : ne tient compte que des colonnes renseignées dans cols (par exemple, la colonne delete n'est pas prise en compte)
	// 	 * @param object elem
	// 	 * @return Array
	// 	 */
	// 	var getIndex_inTab = function(elem) {
	// 		if(elem == undefined) { alert("Erreur programme : elem doit être défini !"); return false; }
	// 		var elem = elem;
	// 		// index
	// 		var tr = $(elem).closest('tr');
	// 		var index = $(tr).index('#'+tablename+' > tbody > tr');
	// 		// col
	// 		var td = $(elem).closest('td');
	// 		var col = $(td).index('#'+tablename+' > tbody > tr > td.in_cols');
	// 		// var col = $(div).index('#'+$(divparent).attr('id')+' > .form-group');
	// 		return {'index': index, 'col': col};
	// 	}


	// 	// mise en place du table header
	// 	$(this).prepend($tab_prototype);
	// 	// colonnes du tableau
	// 	initiateHeader();
	// 	showSubformItem();
	// 	// fillArray();

	// 	// changement de sous-formulaire en cliquant sur une ligne du tableau
	// 	$tab_prototype.on('click', 'tbody > tr > td.change_item', function (e) {
	// 		// alert($(this).index());
	// 		showSubformItem($(this).parent().index());
	// 	});

	// 	// modification dans l'un des sous-formulaires
	// 	// INPUT
	// 	$ul_list_form.on('keyup', 'input', function (e) {
	// 		data = getIndexAndCol_inForm(this);
	// 		if(cols.indexOf(data.col+"") != -1) fillArray();
	// 	});
	// 	// SELECT
	// 	$ul_list_form.on('change', 'select', function (e) {
	// 		data = getIndexAndCol_inForm(this);
	// 		if(cols.indexOf(data.col+"") != -1) fillArray();
	// 	});

	// 	// Ajout d'une ligne
	// 	$addMultiFormLink.on('click', function (e) {
	// 		e.preventDefault();
	// 		addTagForm();
	// 	});

	// 	// Suppression d'une ligne
	// 	$('body').on('click', '[id^='+deletename+']', function (e) {
	// 		e.preventDefault();
	// 		var data = getIndex_inTab(this);
	// 		// modale de confirmation
	// 		var title = $(this).attr('data-confirm-title');
	// 		if(title == undefined) title = 'Confirmation';
	// 		var message = $(this).attr('data-confirm-message');
	// 		if(message == undefined) message = 'Confirmez cette action, s.v.p.';
	// 		var reponse = confirm(title+"\n"+message);
	// 		if(reponse) deleteItem(data.index);
	// 	});
	// });

	// errorMessages.push("Chargement [" + environnementMode + "] complet de data-et-messages.js !");
	// Affichage des erreurs en mode DEV
	var points = "• ";
	if(errorMessages.length > 0 && environnementMode != 'prod') {
		alert(points + errorMessages.join("\n" + points));
	}


});
/*!
 * Cropper v2.2.5
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright (c) 2014-2016 Fengyuan Chen and contributors
 * Released under the MIT license
 *
 * Date: 2016-01-18T05:42:50.800Z
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  // Globals
  var $window = $(window);
  var $document = $(document);
  var location = window.location;
  var ArrayBuffer = window.ArrayBuffer;
  var Uint8Array = window.Uint8Array;
  var DataView = window.DataView;
  var btoa = window.btoa;

  // Constants
  var NAMESPACE = 'cropper';

  // Classes
  var CLASS_MODAL = 'cropper-modal';
  var CLASS_HIDE = 'cropper-hide';
  var CLASS_HIDDEN = 'cropper-hidden';
  var CLASS_INVISIBLE = 'cropper-invisible';
  var CLASS_MOVE = 'cropper-move';
  var CLASS_CROP = 'cropper-crop';
  var CLASS_DISABLED = 'cropper-disabled';
  var CLASS_BG = 'cropper-bg';

  // Events
  var EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
  var EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
  var EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel';
  var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_LOAD = 'load.' + NAMESPACE;
  var EVENT_ERROR = 'error.' + NAMESPACE;
  var EVENT_RESIZE = 'resize.' + NAMESPACE; // Bind to window with namespace
  var EVENT_BUILD = 'build.' + NAMESPACE;
  var EVENT_BUILT = 'built.' + NAMESPACE;
  var EVENT_CROP_START = 'cropstart.' + NAMESPACE;
  var EVENT_CROP_MOVE = 'cropmove.' + NAMESPACE;
  var EVENT_CROP_END = 'cropend.' + NAMESPACE;
  var EVENT_CROP = 'crop.' + NAMESPACE;
  var EVENT_ZOOM = 'zoom.' + NAMESPACE;

  // RegExps
  var REGEXP_ACTIONS = /e|w|s|n|se|sw|ne|nw|all|crop|move|zoom/;
  var REGEXP_DATA_URL = /^data\:/;
  var REGEXP_DATA_URL_HEAD = /^data\:([^\;]+)\;base64,/;
  var REGEXP_DATA_URL_JPEG = /^data\:image\/jpeg.*;base64,/;

  // Data keys
  var DATA_PREVIEW = 'preview';
  var DATA_ACTION = 'action';

  // Actions
  var ACTION_EAST = 'e';
  var ACTION_WEST = 'w';
  var ACTION_SOUTH = 's';
  var ACTION_NORTH = 'n';
  var ACTION_SOUTH_EAST = 'se';
  var ACTION_SOUTH_WEST = 'sw';
  var ACTION_NORTH_EAST = 'ne';
  var ACTION_NORTH_WEST = 'nw';
  var ACTION_ALL = 'all';
  var ACTION_CROP = 'crop';
  var ACTION_MOVE = 'move';
  var ACTION_ZOOM = 'zoom';
  var ACTION_NONE = 'none';

  // Supports
  var SUPPORT_CANVAS = $.isFunction($('<canvas>')[0].getContext);

  // Maths
  var num = Number;
  var min = Math.min;
  var max = Math.max;
  var abs = Math.abs;
  var sin = Math.sin;
  var cos = Math.cos;
  var sqrt = Math.sqrt;
  var round = Math.round;
  var floor = Math.floor;

  // Utilities
  var fromCharCode = String.fromCharCode;

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  function isUndefined(n) {
    return typeof n === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    // This is necessary for IE8
    if (isNumber(offset)) {
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  // Custom proxy to avoid jQuery's guid
  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function isCrossOriginURL(url) {
    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

    return parts && (
      parts[1] !== location.protocol ||
      parts[2] !== location.hostname ||
      parts[3] !== location.port
    );
  }

  function addTimestamp(url) {
    var timestamp = 'timestamp=' + (new Date()).getTime();

    return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
  }

  function getCrossOrigin(crossOrigin) {
    return crossOrigin ? ' crossOrigin="' + crossOrigin + '"' : '';
  }

  function getImageSize(image, callback) {
    var newImage;

    // Modern browsers
    if (image.naturalWidth) {
      return callback(image.naturalWidth, image.naturalHeight);
    }

    // IE8: Don't use `new Image()` here (#319)
    newImage = document.createElement('img');

    newImage.onload = function () {
      callback(this.width, this.height);
    };

    newImage.src = image.src;
  }

  function getTransform(options) {
    var transforms = [];
    var rotate = options.rotate;
    var scaleX = options.scaleX;
    var scaleY = options.scaleY;

    if (isNumber(rotate)) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (isNumber(scaleX) && isNumber(scaleY)) {
      transforms.push('scale(' + scaleX + ',' + scaleY + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  }

  function getRotatedSizes(data, isReversed) {
    var deg = abs(data.degree) % 180;
    var arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;
    var sinArc = sin(arc);
    var cosArc = cos(arc);
    var width = data.width;
    var height = data.height;
    var aspectRatio = data.aspectRatio;
    var newWidth;
    var newHeight;

    if (!isReversed) {
      newWidth = width * cosArc + height * sinArc;
      newHeight = width * sinArc + height * cosArc;
    } else {
      newWidth = width / (cosArc + sinArc / aspectRatio);
      newHeight = newWidth / aspectRatio;
    }

    return {
      width: newWidth,
      height: newHeight
    };
  }

  function getSourceCanvas(image, data) {
    var canvas = $('<canvas>')[0];
    var context = canvas.getContext('2d');
    var x = 0;
    var y = 0;
    var width = data.naturalWidth;
    var height = data.naturalHeight;
    var rotate = data.rotate;
    var scaleX = data.scaleX;
    var scaleY = data.scaleY;
    var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
    var rotatable = isNumber(rotate) && rotate !== 0;
    var advanced = rotatable || scalable;
    var canvasWidth = width;
    var canvasHeight = height;
    var translateX;
    var translateY;
    var rotated;

    if (scalable) {
      translateX = width / 2;
      translateY = height / 2;
    }

    if (rotatable) {
      rotated = getRotatedSizes({
        width: width,
        height: height,
        degree: rotate
      });

      canvasWidth = rotated.width;
      canvasHeight = rotated.height;
      translateX = rotated.width / 2;
      translateY = rotated.height / 2;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (advanced) {
      x = -width / 2;
      y = -height / 2;

      context.save();
      context.translate(translateX, translateY);
    }

    if (rotatable) {
      context.rotate(rotate * Math.PI / 180);
    }

    // Should call `scale` after rotated
    if (scalable) {
      context.scale(scaleX, scaleY);
    }

    context.drawImage(image, floor(x), floor(y), floor(width), floor(height));

    if (advanced) {
      context.restore();
    }

    return canvas;
  }

  function getTouchesCenter(touches) {
    var length = touches.length;
    var pageX = 0;
    var pageY = 0;

    if (length) {
      $.each(touches, function (i, touch) {
        pageX += touch.pageX;
        pageY += touch.pageY;
      });

      pageX /= length;
      pageY /= length;
    }

    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  function getStringFromCharCode(dataView, start, length) {
    var str = '';
    var i;

    for (i = start, length += start; i < length; i++) {
      str += fromCharCode(dataView.getUint8(i));
    }

    return str;
  }

  function getOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var length = dataView.byteLength;
    var orientation;
    var exifIDCode;
    var tiffOffset;
    var firstIFDOffset;
    var littleEndian;
    var endianness;
    var app1Start;
    var ifdStart;
    var offset;
    var i;

    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      offset = 2;

      while (offset < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset++;
      }
    }

    if (app1Start) {
      exifIDCode = app1Start + 4;
      tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        endianness = dataView.getUint16(tiffOffset);
        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
      }
    }

    if (ifdStart) {
      length = dataView.getUint16(ifdStart, littleEndian);

      for (i = 0; i < length; i++) {
        offset = ifdStart + i * 12 + 2;

        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with the default value: 1
          dataView.setUint16(offset, 1, littleEndian);
          break;
        }
      }
    }

    return orientation;
  }

  function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
    var binary = atob(base64);
    var length = binary.length;
    var arrayBuffer = new ArrayBuffer(length);
    var dataView = new Uint8Array(arrayBuffer);
    var i;

    for (i = 0; i < length; i++) {
      dataView[i] = binary.charCodeAt(i);
    }

    return arrayBuffer;
  }

  // Only available for JPEG image
  function arrayBufferToDataURL(arrayBuffer) {
    var dataView = new Uint8Array(arrayBuffer);
    var length = dataView.length;
    var base64 = '';
    var i;

    for (i = 0; i < length; i++) {
      base64 += fromCharCode(dataView[i]);
    }

    return 'data:image/jpeg;base64,' + btoa(base64);
  }

  function Cropper(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Cropper.DEFAULTS, $.isPlainObject(options) && options);
    this.isLoaded = false;
    this.isBuilt = false;
    this.isCompleted = false;
    this.isRotated = false;
    this.isCropped = false;
    this.isDisabled = false;
    this.isReplaced = false;
    this.isLimited = false;
    this.wheeling = false;
    this.isImg = false;
    this.originalUrl = '';
    this.canvas = null;
    this.cropBox = null;
    this.init();
  }

  Cropper.prototype = {
    constructor: Cropper,

    init: function () {
      var $this = this.$element;
      var url;

      if ($this.is('img')) {
        this.isImg = true;

        // Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
        this.originalUrl = url = $this.attr('src');

        // Stop when it's a blank image
        if (!url) {
          return;
        }

        // Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
        url = $this.prop('src');
      } else if ($this.is('canvas') && SUPPORT_CANVAS) {
        url = $this[0].toDataURL();
      }

      this.load(url);
    },

    // A shortcut for triggering custom events
    trigger: function (type, data) {
      var e = $.Event(type, data);

      this.$element.trigger(e);

      return e;
    },

    load: function (url) {
      var options = this.options;
      var $this = this.$element;
      var read;
      var xhr;

      if (!url) {
        return;
      }

      // Trigger build event first
      $this.one(EVENT_BUILD, options.build);

      if (this.trigger(EVENT_BUILD).isDefaultPrevented()) {
        return;
      }

      this.url = url;
      this.image = {};

      if (!options.checkOrientation || !ArrayBuffer) {
        return this.clone();
      }

      read = $.proxy(this.read, this);

      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
      if (REGEXP_DATA_URL.test(url)) {
        return REGEXP_DATA_URL_JPEG.test(url) ?
          read(dataURLToArrayBuffer(url)) :
          this.clone();
      }

      xhr = new XMLHttpRequest();

      xhr.onerror = xhr.onabort = $.proxy(function () {
        this.clone();
      }, this);

      xhr.onload = function () {
        read(this.response);
      };

      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.send();
    },

    read: function (arrayBuffer) {
      var options = this.options;
      var orientation = getOrientation(arrayBuffer);
      var image = this.image;
      var rotate;
      var scaleX;
      var scaleY;

      if (orientation > 1) {
        this.url = arrayBufferToDataURL(arrayBuffer);

        switch (orientation) {

          // flip horizontal
          case 2:
            scaleX = -1;
            break;

          // rotate left 180°
          case 3:
            rotate = -180;
            break;

          // flip vertical
          case 4:
            scaleY = -1;
            break;

          // flip vertical + rotate right 90°
          case 5:
            rotate = 90;
            scaleY = -1;
            break;

          // rotate right 90°
          case 6:
            rotate = 90;
            break;

          // flip horizontal + rotate right 90°
          case 7:
            rotate = 90;
            scaleX = -1;
            break;

          // rotate left 90°
          case 8:
            rotate = -90;
            break;
        }
      }

      if (options.rotatable) {
        image.rotate = rotate;
      }

      if (options.scalable) {
        image.scaleX = scaleX;
        image.scaleY = scaleY;
      }

      this.clone();
    },

    clone: function () {
      var options = this.options;
      var $this = this.$element;
      var url = this.url;
      var crossOrigin = '';
      var crossOriginUrl;
      var $clone;

      if (options.checkCrossOrigin && isCrossOriginURL(url)) {
        crossOrigin = $this.prop('crossOrigin');

        if (crossOrigin) {
          crossOriginUrl = url;
        } else {
          crossOrigin = 'anonymous';

          // Bust cache (#148) when there is not a "crossOrigin" property
          crossOriginUrl = addTimestamp(url);
        }
      }

      this.crossOrigin = crossOrigin;
      this.crossOriginUrl = crossOriginUrl;
      this.$clone = $clone = $('<img' + getCrossOrigin(crossOrigin) + ' src="' + (crossOriginUrl || url) + '">');

      if (this.isImg) {
        if ($this[0].complete) {
          this.start();
        } else {
          $this.one(EVENT_LOAD, $.proxy(this.start, this));
        }
      } else {
        $clone.
          one(EVENT_LOAD, $.proxy(this.start, this)).
          one(EVENT_ERROR, $.proxy(this.stop, this)).
          addClass(CLASS_HIDE).
          insertAfter($this);
      }
    },

    start: function () {
      var $image = this.$element;
      var $clone = this.$clone;

      if (!this.isImg) {
        $clone.off(EVENT_ERROR, this.stop);
        $image = $clone;
      }

      getImageSize($image[0], $.proxy(function (naturalWidth, naturalHeight) {
        $.extend(this.image, {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: naturalWidth / naturalHeight
        });

        this.isLoaded = true;
        this.build();
      }, this));
    },

    stop: function () {
      this.$clone.remove();
      this.$clone = null;
    },

    build: function () {
      var options = this.options;
      var $this = this.$element;
      var $clone = this.$clone;
      var $cropper;
      var $cropBox;
      var $face;

      if (!this.isLoaded) {
        return;
      }

      // Unbuild first when replace
      if (this.isBuilt) {
        this.unbuild();
      }

      // Create cropper elements
      this.$container = $this.parent();
      this.$cropper = $cropper = $(Cropper.TEMPLATE);
      this.$canvas = $cropper.find('.cropper-canvas').append($clone);
      this.$dragBox = $cropper.find('.cropper-drag-box');
      this.$cropBox = $cropBox = $cropper.find('.cropper-crop-box');
      this.$viewBox = $cropper.find('.cropper-view-box');
      this.$face = $face = $cropBox.find('.cropper-face');

      // Hide the original image
      $this.addClass(CLASS_HIDDEN).after($cropper);

      // Show the clone image if is hidden
      if (!this.isImg) {
        $clone.removeClass(CLASS_HIDE);
      }

      this.initPreview();
      this.bind();

      options.aspectRatio = max(0, options.aspectRatio) || NaN;
      options.viewMode = max(0, min(3, round(options.viewMode))) || 0;

      if (options.autoCrop) {
        this.isCropped = true;

        if (options.modal) {
          this.$dragBox.addClass(CLASS_MODAL);
        }
      } else {
        $cropBox.addClass(CLASS_HIDDEN);
      }

      if (!options.guides) {
        $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
      }

      if (!options.center) {
        $cropBox.find('.cropper-center').addClass(CLASS_HIDDEN);
      }

      if (options.cropBoxMovable) {
        $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
      }

      if (!options.highlight) {
        $face.addClass(CLASS_INVISIBLE);
      }

      if (options.background) {
        $cropper.addClass(CLASS_BG);
      }

      if (!options.cropBoxResizable) {
        $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
      }

      this.setDragMode(options.dragMode);
      this.render();
      this.isBuilt = true;
      this.setData(options.data);
      $this.one(EVENT_BUILT, options.built);

      // Trigger the built event asynchronously to keep `data('cropper')` is defined
      setTimeout($.proxy(function () {
        this.trigger(EVENT_BUILT);
        this.isCompleted = true;
      }, this), 0);
    },

    unbuild: function () {
      if (!this.isBuilt) {
        return;
      }

      this.isBuilt = false;
      this.isCompleted = false;
      this.initialImage = null;

      // Clear `initialCanvas` is necessary when replace
      this.initialCanvas = null;
      this.initialCropBox = null;
      this.container = null;
      this.canvas = null;

      // Clear `cropBox` is necessary when replace
      this.cropBox = null;
      this.unbind();

      this.resetPreview();
      this.$preview = null;

      this.$viewBox = null;
      this.$cropBox = null;
      this.$dragBox = null;
      this.$canvas = null;
      this.$container = null;

      this.$cropper.remove();
      this.$cropper = null;
    },

    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();

      this.renderCanvas();

      if (this.isCropped) {
        this.renderCropBox();
      }
    },

    initContainer: function () {
      var options = this.options;
      var $this = this.$element;
      var $container = this.$container;
      var $cropper = this.$cropper;

      $cropper.addClass(CLASS_HIDDEN);
      $this.removeClass(CLASS_HIDDEN);

      $cropper.css((this.container = {
        width: max($container.width(), num(options.minContainerWidth) || 200),
        height: max($container.height(), num(options.minContainerHeight) || 100)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    // Canvas (image wrapper)
    initCanvas: function () {
      var viewMode = this.options.viewMode;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var image = this.image;
      var imageNaturalWidth = image.naturalWidth;
      var imageNaturalHeight = image.naturalHeight;
      var is90Degree = abs(image.rotate) === 90;
      var naturalWidth = is90Degree ? imageNaturalHeight : imageNaturalWidth;
      var naturalHeight = is90Degree ? imageNaturalWidth : imageNaturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var canvasWidth = containerWidth;
      var canvasHeight = containerHeight;
      var canvas;

      if (containerHeight * aspectRatio > containerWidth) {
        if (viewMode === 3) {
          canvasWidth = containerHeight * aspectRatio;
        } else {
          canvasHeight = containerWidth / aspectRatio;
        }
      } else {
        if (viewMode === 3) {
          canvasHeight = containerWidth / aspectRatio;
        } else {
          canvasWidth = containerHeight * aspectRatio;
        }
      }

      canvas = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: aspectRatio,
        width: canvasWidth,
        height: canvasHeight
      };

      canvas.oldLeft = canvas.left = (containerWidth - canvasWidth) / 2;
      canvas.oldTop = canvas.top = (containerHeight - canvasHeight) / 2;

      this.canvas = canvas;
      this.isLimited = (viewMode === 1 || viewMode === 2);
      this.limitCanvas(true, true);
      this.initialImage = $.extend({}, image);
      this.initialCanvas = $.extend({}, canvas);
    },

    limitCanvas: function (isSizeLimited, isPositionLimited) {
      var options = this.options;
      var viewMode = options.viewMode;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      var aspectRatio = canvas.aspectRatio;
      var cropBox = this.cropBox;
      var isCropped = this.isCropped && cropBox;
      var minCanvasWidth;
      var minCanvasHeight;
      var newCanvasLeft;
      var newCanvasTop;

      if (isSizeLimited) {
        minCanvasWidth = num(options.minCanvasWidth) || 0;
        minCanvasHeight = num(options.minCanvasHeight) || 0;

        if (viewMode) {
          if (viewMode > 1) {
            minCanvasWidth = max(minCanvasWidth, containerWidth);
            minCanvasHeight = max(minCanvasHeight, containerHeight);

            if (viewMode === 3) {
              if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                minCanvasWidth = minCanvasHeight * aspectRatio;
              } else {
                minCanvasHeight = minCanvasWidth / aspectRatio;
              }
            }
          } else {
            if (minCanvasWidth) {
              minCanvasWidth = max(minCanvasWidth, isCropped ? cropBox.width : 0);
            } else if (minCanvasHeight) {
              minCanvasHeight = max(minCanvasHeight, isCropped ? cropBox.height : 0);
            } else if (isCropped) {
              minCanvasWidth = cropBox.width;
              minCanvasHeight = cropBox.height;

              if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                minCanvasWidth = minCanvasHeight * aspectRatio;
              } else {
                minCanvasHeight = minCanvasWidth / aspectRatio;
              }
            }
          }
        }

        if (minCanvasWidth && minCanvasHeight) {
          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          } else {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          }
        } else if (minCanvasWidth) {
          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else if (minCanvasHeight) {
          minCanvasWidth = minCanvasHeight * aspectRatio;
        }

        canvas.minWidth = minCanvasWidth;
        canvas.minHeight = minCanvasHeight;
        canvas.maxWidth = Infinity;
        canvas.maxHeight = Infinity;
      }

      if (isPositionLimited) {
        if (viewMode) {
          newCanvasLeft = containerWidth - canvas.width;
          newCanvasTop = containerHeight - canvas.height;

          canvas.minLeft = min(0, newCanvasLeft);
          canvas.minTop = min(0, newCanvasTop);
          canvas.maxLeft = max(0, newCanvasLeft);
          canvas.maxTop = max(0, newCanvasTop);

          if (isCropped && this.isLimited) {
            canvas.minLeft = min(
              cropBox.left,
              cropBox.left + cropBox.width - canvas.width
            );
            canvas.minTop = min(
              cropBox.top,
              cropBox.top + cropBox.height - canvas.height
            );
            canvas.maxLeft = cropBox.left;
            canvas.maxTop = cropBox.top;

            if (viewMode === 2) {
              if (canvas.width >= containerWidth) {
                canvas.minLeft = min(0, newCanvasLeft);
                canvas.maxLeft = max(0, newCanvasLeft);
              }

              if (canvas.height >= containerHeight) {
                canvas.minTop = min(0, newCanvasTop);
                canvas.maxTop = max(0, newCanvasTop);
              }
            }
          }
        } else {
          canvas.minLeft = -canvas.width;
          canvas.minTop = -canvas.height;
          canvas.maxLeft = containerWidth;
          canvas.maxTop = containerHeight;
        }
      }
    },

    renderCanvas: function (isChanged) {
      var canvas = this.canvas;
      var image = this.image;
      var rotate = image.rotate;
      var naturalWidth = image.naturalWidth;
      var naturalHeight = image.naturalHeight;
      var aspectRatio;
      var rotated;

      if (this.isRotated) {
        this.isRotated = false;

        // Computes rotated sizes with image sizes
        rotated = getRotatedSizes({
          width: image.width,
          height: image.height,
          degree: rotate
        });

        aspectRatio = rotated.width / rotated.height;

        if (aspectRatio !== canvas.aspectRatio) {
          canvas.left -= (rotated.width - canvas.width) / 2;
          canvas.top -= (rotated.height - canvas.height) / 2;
          canvas.width = rotated.width;
          canvas.height = rotated.height;
          canvas.aspectRatio = aspectRatio;
          canvas.naturalWidth = naturalWidth;
          canvas.naturalHeight = naturalHeight;

          // Computes rotated sizes with natural image sizes
          if (rotate % 180) {
            rotated = getRotatedSizes({
              width: naturalWidth,
              height: naturalHeight,
              degree: rotate
            });

            canvas.naturalWidth = rotated.width;
            canvas.naturalHeight = rotated.height;
          }

          this.limitCanvas(true, false);
        }
      }

      if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
        canvas.left = canvas.oldLeft;
      }

      if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
        canvas.top = canvas.oldTop;
      }

      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

      this.limitCanvas(false, true);

      canvas.oldLeft = canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
      canvas.oldTop = canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

      this.$canvas.css({
        width: canvas.width,
        height: canvas.height,
        left: canvas.left,
        top: canvas.top
      });

      this.renderImage();

      if (this.isCropped && this.isLimited) {
        this.limitCropBox(true, true);
      }

      if (isChanged) {
        this.output();
      }
    },

    renderImage: function (isChanged) {
      var canvas = this.canvas;
      var image = this.image;
      var reversed;

      if (image.rotate) {
        reversed = getRotatedSizes({
          width: canvas.width,
          height: canvas.height,
          degree: image.rotate,
          aspectRatio: image.aspectRatio
        }, true);
      }

      $.extend(image, reversed ? {
        width: reversed.width,
        height: reversed.height,
        left: (canvas.width - reversed.width) / 2,
        top: (canvas.height - reversed.height) / 2
      } : {
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0
      });

      this.$clone.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getTransform(image)
      });

      if (isChanged) {
        this.output();
      }
    },

    initCropBox: function () {
      var options = this.options;
      var canvas = this.canvas;
      var aspectRatio = options.aspectRatio;
      var autoCropArea = num(options.autoCropArea) || 0.8;
      var cropBox = {
            width: canvas.width,
            height: canvas.height
          };

      if (aspectRatio) {
        if (canvas.height * aspectRatio > canvas.width) {
          cropBox.height = cropBox.width / aspectRatio;
        } else {
          cropBox.width = cropBox.height * aspectRatio;
        }
      }

      this.cropBox = cropBox;
      this.limitCropBox(true, true);

      // Initialize auto crop area
      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      // The width of auto crop area must large than "minWidth", and the height too. (#164)
      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
      cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
      cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;

      this.initialCropBox = $.extend({}, cropBox);
    },

    limitCropBox: function (isSizeLimited, isPositionLimited) {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
      var isLimited = this.isLimited;
      var minCropBoxWidth;
      var minCropBoxHeight;
      var maxCropBoxWidth;
      var maxCropBoxHeight;

      if (isSizeLimited) {
        minCropBoxWidth = num(options.minCropBoxWidth) || 0;
        minCropBoxHeight = num(options.minCropBoxHeight) || 0;

        // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
        minCropBoxWidth = min(minCropBoxWidth, containerWidth);
        minCropBoxHeight = min(minCropBoxHeight, containerHeight);
        maxCropBoxWidth = min(containerWidth, isLimited ? canvas.width : containerWidth);
        maxCropBoxHeight = min(containerHeight, isLimited ? canvas.height : containerHeight);

        if (aspectRatio) {
          if (minCropBoxWidth && minCropBoxHeight) {
            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }
          } else if (minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else if (minCropBoxHeight) {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }

          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
          } else {
            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
          }
        }

        // The minWidth/Height must be less than maxWidth/Height
        cropBox.minWidth = min(minCropBoxWidth, maxCropBoxWidth);
        cropBox.minHeight = min(minCropBoxHeight, maxCropBoxHeight);
        cropBox.maxWidth = maxCropBoxWidth;
        cropBox.maxHeight = maxCropBoxHeight;
      }

      if (isPositionLimited) {
        if (isLimited) {
          cropBox.minLeft = max(0, canvas.left);
          cropBox.minTop = max(0, canvas.top);
          cropBox.maxLeft = min(containerWidth, canvas.left + canvas.width) - cropBox.width;
          cropBox.maxTop = min(containerHeight, canvas.top + canvas.height) - cropBox.height;
        } else {
          cropBox.minLeft = 0;
          cropBox.minTop = 0;
          cropBox.maxLeft = containerWidth - cropBox.width;
          cropBox.maxTop = containerHeight - cropBox.height;
        }
      }
    },

    renderCropBox: function () {
      var options = this.options;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var cropBox = this.cropBox;

      if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
        cropBox.left = cropBox.oldLeft;
      }

      if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
        cropBox.top = cropBox.oldTop;
      }

      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      this.limitCropBox(false, true);

      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
      cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

      if (options.movable && options.cropBoxMovable) {

        // Turn to move the canvas when the crop box is equal to the container
        this.$face.data(DATA_ACTION, (cropBox.width === containerWidth && cropBox.height === containerHeight) ? ACTION_MOVE : ACTION_ALL);
      }

      this.$cropBox.css({
        width: cropBox.width,
        height: cropBox.height,
        left: cropBox.left,
        top: cropBox.top
      });

      if (this.isCropped && this.isLimited) {
        this.limitCanvas(true, true);
      }

      if (!this.isDisabled) {
        this.output();
      }
    },

    output: function () {
      this.preview();

      if (this.isCompleted) {
        this.trigger(EVENT_CROP, this.getData());
      } else if (!this.isBuilt) {

        // Only trigger one crop event before complete
        this.$element.one(EVENT_BUILT, $.proxy(function () {
          this.trigger(EVENT_CROP, this.getData());
        }, this));
      }
    },

    initPreview: function () {
      var crossOrigin = getCrossOrigin(this.crossOrigin);
      var url = crossOrigin ? this.crossOriginUrl : this.url;

      this.$preview = $(this.options.preview);
      this.$viewBox.html('<img' + crossOrigin + ' src="' + url + '">');
      this.$preview.each(function () {
        var $this = $(this);

        // Save the original size for recover
        $this.data(DATA_PREVIEW, {
          width: $this.width(),
          height: $this.height(),
          html: $this.html()
        });

        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * (Occur only when margin-top <= -height)
         */
        $this.html(
          '<img' + crossOrigin + ' src="' + url + '" style="' +
          'display:block;width:100%;height:auto;' +
          'min-width:0!important;min-height:0!important;' +
          'max-width:none!important;max-height:none!important;' +
          'image-orientation:0deg!important;">'
        );
      });
    },

    resetPreview: function () {
      this.$preview.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_PREVIEW);

        $this.css({
          width: data.width,
          height: data.height
        }).html(data.html).removeData(DATA_PREVIEW);
      });
    },

    preview: function () {
      var image = this.image;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
      var cropBoxWidth = cropBox.width;
      var cropBoxHeight = cropBox.height;
      var width = image.width;
      var height = image.height;
      var left = cropBox.left - canvas.left - image.left;
      var top = cropBox.top - canvas.top - image.top;

      if (!this.isCropped || this.isDisabled) {
        return;
      }

      this.$viewBox.find('img').css({
        width: width,
        height: height,
        marginLeft: -left,
        marginTop: -top,
        transform: getTransform(image)
      });

      this.$preview.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        $this.css({
          width: newWidth,
          height: newHeight
        }).find('img').css({
          width: width * ratio,
          height: height * ratio,
          marginLeft: -left * ratio,
          marginTop: -top * ratio,
          transform: getTransform(image)
        });
      });
    },

    bind: function () {
      var options = this.options;
      var $this = this.$element;
      var $cropper = this.$cropper;

      if ($.isFunction(options.cropstart)) {
        $this.on(EVENT_CROP_START, options.cropstart);
      }

      if ($.isFunction(options.cropmove)) {
        $this.on(EVENT_CROP_MOVE, options.cropmove);
      }

      if ($.isFunction(options.cropend)) {
        $this.on(EVENT_CROP_END, options.cropend);
      }

      if ($.isFunction(options.crop)) {
        $this.on(EVENT_CROP, options.crop);
      }

      if ($.isFunction(options.zoom)) {
        $this.on(EVENT_ZOOM, options.zoom);
      }

      $cropper.on(EVENT_MOUSE_DOWN, $.proxy(this.cropStart, this));

      if (options.zoomable && options.zoomOnWheel) {
        $cropper.on(EVENT_WHEEL, $.proxy(this.wheel, this));
      }

      if (options.toggleDragModeOnDblclick) {
        $cropper.on(EVENT_DBLCLICK, $.proxy(this.dblclick, this));
      }

      $document.
        on(EVENT_MOUSE_MOVE, (this._cropMove = proxy(this.cropMove, this))).
        on(EVENT_MOUSE_UP, (this._cropEnd = proxy(this.cropEnd, this)));

      if (options.responsive) {
        $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
      }
    },

    unbind: function () {
      var options = this.options;
      var $this = this.$element;
      var $cropper = this.$cropper;

      if ($.isFunction(options.cropstart)) {
        $this.off(EVENT_CROP_START, options.cropstart);
      }

      if ($.isFunction(options.cropmove)) {
        $this.off(EVENT_CROP_MOVE, options.cropmove);
      }

      if ($.isFunction(options.cropend)) {
        $this.off(EVENT_CROP_END, options.cropend);
      }

      if ($.isFunction(options.crop)) {
        $this.off(EVENT_CROP, options.crop);
      }

      if ($.isFunction(options.zoom)) {
        $this.off(EVENT_ZOOM, options.zoom);
      }

      $cropper.off(EVENT_MOUSE_DOWN, this.cropStart);

      if (options.zoomable && options.zoomOnWheel) {
        $cropper.off(EVENT_WHEEL, this.wheel);
      }

      if (options.toggleDragModeOnDblclick) {
        $cropper.off(EVENT_DBLCLICK, this.dblclick);
      }

      $document.
        off(EVENT_MOUSE_MOVE, this._cropMove).
        off(EVENT_MOUSE_UP, this._cropEnd);

      if (options.responsive) {
        $window.off(EVENT_RESIZE, this._resize);
      }
    },

    resize: function () {
      var restore = this.options.restore;
      var $container = this.$container;
      var container = this.container;
      var canvasData;
      var cropBoxData;
      var ratio;

      // Check `container` is necessary for IE8
      if (this.isDisabled || !container) {
        return;
      }

      ratio = $container.width() / container.width;

      // Resize when width changed or height changed
      if (ratio !== 1 || $container.height() !== container.height) {
        if (restore) {
          canvasData = this.getCanvasData();
          cropBoxData = this.getCropBoxData();
        }

        this.render();

        if (restore) {
          this.setCanvasData($.each(canvasData, function (i, n) {
            canvasData[i] = n * ratio;
          }));
          this.setCropBoxData($.each(cropBoxData, function (i, n) {
            cropBoxData[i] = n * ratio;
          }));
        }
      }
    },

    dblclick: function () {
      if (this.isDisabled) {
        return;
      }

      if (this.$dragBox.hasClass(CLASS_CROP)) {
        this.setDragMode(ACTION_MOVE);
      } else {
        this.setDragMode(ACTION_CROP);
      }
    },

    wheel: function (event) {
      var e = event.originalEvent || event;
      var ratio = num(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.isDisabled) {
        return;
      }

      event.preventDefault();

      // Limit wheel speed to prevent zoom too fast
      if (this.wheeling) {
        return;
      }

      this.wheeling = true;

      setTimeout($.proxy(function () {
        this.wheeling = false;
      }, this), 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, event);
    },

    cropStart: function (event) {
      var options = this.options;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = event;
      var touchesLength;
      var action;

      if (this.isDisabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
            e = touches[1];
            this.startX2 = e.pageX;
            this.startY2 = e.pageY;
            action = ACTION_ZOOM;
          } else {
            return;
          }
        }

        e = touches[0];
      }

      action = action || $(e.target).data(DATA_ACTION);

      if (REGEXP_ACTIONS.test(action)) {
        if (this.trigger(EVENT_CROP_START, {
          originalEvent: originalEvent,
          action: action
        }).isDefaultPrevented()) {
          return;
        }

        event.preventDefault();

        this.action = action;
        this.cropping = false;

        // IE8  has `event.pageX/Y`, but not `event.originalEvent.pageX/Y`
        // IE10 has `event.originalEvent.pageX/Y`, but not `event.pageX/Y`
        this.startX = e.pageX || originalEvent && originalEvent.pageX;
        this.startY = e.pageY || originalEvent && originalEvent.pageY;

        if (action === ACTION_CROP) {
          this.cropping = true;
          this.$dragBox.addClass(CLASS_MODAL);
        }
      }
    },

    cropMove: function (event) {
      var options = this.options;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = event;
      var action = this.action;
      var touchesLength;

      if (this.isDisabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
            e = touches[1];
            this.endX2 = e.pageX;
            this.endY2 = e.pageY;
          } else {
            return;
          }
        }

        e = touches[0];
      }

      if (action) {
        if (this.trigger(EVENT_CROP_MOVE, {
          originalEvent: originalEvent,
          action: action
        }).isDefaultPrevented()) {
          return;
        }

        event.preventDefault();

        this.endX = e.pageX || originalEvent && originalEvent.pageX;
        this.endY = e.pageY || originalEvent && originalEvent.pageY;

        this.change(e.shiftKey, action === ACTION_ZOOM ? event : null);
      }
    },

    cropEnd: function (event) {
      var originalEvent = event.originalEvent;
      var action = this.action;

      if (this.isDisabled) {
        return;
      }

      if (action) {
        event.preventDefault();

        if (this.cropping) {
          this.cropping = false;
          this.$dragBox.toggleClass(CLASS_MODAL, this.isCropped && this.options.modal);
        }

        this.action = '';

        this.trigger(EVENT_CROP_END, {
          originalEvent: originalEvent,
          action: action
        });
      }
    },

    change: function (shiftKey, event) {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var action = this.action;
      var container = this.container;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
      var width = cropBox.width;
      var height = cropBox.height;
      var left = cropBox.left;
      var top = cropBox.top;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = container.width;
      var maxHeight = container.height;
      var renderable = true;
      var offset;
      var range;

      // Locking aspect ratio in "free mode" by holding shift key (#259)
      if (!aspectRatio && shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (this.limited) {
        minLeft = cropBox.minLeft;
        minTop = cropBox.minTop;
        maxWidth = minLeft + min(container.width, canvas.width);
        maxHeight = minTop + min(container.height, canvas.height);
      }

      range = {
        x: this.endX - this.startX,
        y: this.endY - this.startY
      };

      if (aspectRatio) {
        range.X = range.y * aspectRatio;
        range.Y = range.x / aspectRatio;
      }

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;

        // Resize crop box
        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top -= range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_WEST;
            width = 0;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left += range.X / 2;
          }

          if (height < 0) {
            action = ACTION_SOUTH;
            height = 0;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top += range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_EAST;
            width = 0;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left -= range.X / 2;
          }

          if (height < 0) {
            action = ACTION_NORTH;
            height = 0;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += range.X;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
          }

          break;

        // Move canvas
        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;

        // Zoom canvas
        case ACTION_ZOOM:
          this.zoom((function (x1, y1, x2, y2) {
            var z1 = sqrt(x1 * x1 + y1 * y1);
            var z2 = sqrt(x2 * x2 + y2 * y2);

            return (z2 - z1) / z1;
          })(
            abs(this.startX - this.startX2),
            abs(this.startY - this.startY2),
            abs(this.endX - this.endX2),
            abs(this.endY - this.endY2)
          ), event);
          this.startX2 = this.endX2;
          this.startY2 = this.endY2;
          renderable = false;
          break;

        // Create crop box
        case ACTION_CROP:
          if (!range.x || !range.y) {
            renderable = false;
            break;
          }

          offset = this.$cropper.offset();
          left = this.startX - offset.left;
          top = this.startY - offset.top;
          width = cropBox.minWidth;
          height = cropBox.minHeight;

          if (range.x > 0) {
            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
          } else if (range.x < 0) {
            left -= width;
            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
          }

          if (range.y < 0) {
            top -= height;
          }

          // Show the crop box if is hidden
          if (!this.isCropped) {
            this.$cropBox.removeClass(CLASS_HIDDEN);
            this.isCropped = true;

            if (this.limited) {
              this.limitCropBox(true, true);
            }
          }

          break;

        // No default
      }

      if (renderable) {
        cropBox.width = width;
        cropBox.height = height;
        cropBox.left = left;
        cropBox.top = top;
        this.action = action;

        this.renderCropBox();
      }

      // Override
      this.startX = this.endX;
      this.startY = this.endY;
    },

    // Show the crop box manually
    crop: function () {
      if (!this.isBuilt || this.isDisabled) {
        return;
      }

      if (!this.isCropped) {
        this.isCropped = true;
        this.limitCropBox(true, true);

        if (this.options.modal) {
          this.$dragBox.addClass(CLASS_MODAL);
        }

        this.$cropBox.removeClass(CLASS_HIDDEN);
      }

      this.setCropBoxData(this.initialCropBox);
    },

    // Reset the image and crop box to their initial states
    reset: function () {
      if (!this.isBuilt || this.isDisabled) {
        return;
      }

      this.image = $.extend({}, this.initialImage);
      this.canvas = $.extend({}, this.initialCanvas);
      this.cropBox = $.extend({}, this.initialCropBox);

      this.renderCanvas();

      if (this.isCropped) {
        this.renderCropBox();
      }
    },

    // Clear the crop box
    clear: function () {
      if (!this.isCropped || this.isDisabled) {
        return;
      }

      $.extend(this.cropBox, {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      });

      this.isCropped = false;
      this.renderCropBox();

      this.limitCanvas(true, true);

      // Render canvas after crop box rendered
      this.renderCanvas();

      this.$dragBox.removeClass(CLASS_MODAL);
      this.$cropBox.addClass(CLASS_HIDDEN);
    },

    /**
     * Replace the image's src and rebuild the cropper
     *
     * @param {String} url
     */
    replace: function (url) {
      if (!this.isDisabled && url) {
        if (this.isImg) {
          this.isReplaced = true;
          this.$element.attr('src', url);
        }

        // Clear previous data
        this.options.data = null;
        this.load(url);
      }
    },

    // Enable (unfreeze) the cropper
    enable: function () {
      if (this.isBuilt) {
        this.isDisabled = false;
        this.$cropper.removeClass(CLASS_DISABLED);
      }
    },

    // Disable (freeze) the cropper
    disable: function () {
      if (this.isBuilt) {
        this.isDisabled = true;
        this.$cropper.addClass(CLASS_DISABLED);
      }
    },

    // Destroy the cropper and remove the instance from the image
    destroy: function () {
      var $this = this.$element;

      if (this.isLoaded) {
        if (this.isImg && this.isReplaced) {
          $this.attr('src', this.originalUrl);
        }

        this.unbuild();
        $this.removeClass(CLASS_HIDDEN);
      } else {
        if (this.isImg) {
          $this.off(EVENT_LOAD, this.start);
        } else if (this.$clone) {
          this.$clone.remove();
        }
      }

      $this.removeData(NAMESPACE);
    },

    /**
     * Move the canvas with relative offsets
     *
     * @param {Number} offsetX
     * @param {Number} offsetY (optional)
     */
    move: function (offsetX, offsetY) {
      var canvas = this.canvas;

      this.moveTo(
        isUndefined(offsetX) ? offsetX : canvas.left + num(offsetX),
        isUndefined(offsetY) ? offsetY : canvas.top + num(offsetY)
      );
    },

    /**
     * Move the canvas to an absolute point
     *
     * @param {Number} x
     * @param {Number} y (optional)
     */
    moveTo: function (x, y) {
      var canvas = this.canvas;
      var isChanged = false;

      // If "y" is not present, its default value is "x"
      if (isUndefined(y)) {
        y = x;
      }

      x = num(x);
      y = num(y);

      if (this.isBuilt && !this.isDisabled && this.options.movable) {
        if (isNumber(x)) {
          canvas.left = x;
          isChanged = true;
        }

        if (isNumber(y)) {
          canvas.top = y;
          isChanged = true;
        }

        if (isChanged) {
          this.renderCanvas(true);
        }
      }
    },

    /**
     * Zoom the canvas with a relative ratio
     *
     * @param {Number} ratio
     * @param {jQuery Event} _event (private)
     */
    zoom: function (ratio, _event) {
      var canvas = this.canvas;

      ratio = num(ratio);

      if (ratio < 0) {
        ratio =  1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      this.zoomTo(canvas.width * ratio / canvas.naturalWidth, _event);
    },

    /**
     * Zoom the canvas to an absolute ratio
     *
     * @param {Number} ratio
     * @param {jQuery Event} _event (private)
     */
    zoomTo: function (ratio, _event) {
      var options = this.options;
      var canvas = this.canvas;
      var width = canvas.width;
      var height = canvas.height;
      var naturalWidth = canvas.naturalWidth;
      var naturalHeight = canvas.naturalHeight;
      var originalEvent;
      var newWidth;
      var newHeight;
      var offset;
      var center;

      ratio = num(ratio);

      if (ratio >= 0 && this.isBuilt && !this.isDisabled && options.zoomable) {
        newWidth = naturalWidth * ratio;
        newHeight = naturalHeight * ratio;

        if (_event) {
          originalEvent = _event.originalEvent;
        }

        if (this.trigger(EVENT_ZOOM, {
          originalEvent: originalEvent,
          oldRatio: width / naturalWidth,
          ratio: newWidth / naturalWidth
        }).isDefaultPrevented()) {
          return;
        }

        if (originalEvent) {
          offset = this.$cropper.offset();
          center = originalEvent.touches ? getTouchesCenter(originalEvent.touches) : {
            pageX: _event.pageX || originalEvent.pageX || 0,
            pageY: _event.pageY || originalEvent.pageY || 0
          };

          // Zoom from the triggering point of the event
          canvas.left -= (newWidth - width) * (
            ((center.pageX - offset.left) - canvas.left) / width
          );
          canvas.top -= (newHeight - height) * (
            ((center.pageY - offset.top) - canvas.top) / height
          );
        } else {

          // Zoom from the center of the canvas
          canvas.left -= (newWidth - width) / 2;
          canvas.top -= (newHeight - height) / 2;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        this.renderCanvas(true);
      }
    },

    /**
     * Rotate the canvas with a relative degree
     *
     * @param {Number} degree
     */
    rotate: function (degree) {
      this.rotateTo((this.image.rotate || 0) + num(degree));
    },

    /**
     * Rotate the canvas to an absolute degree
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
     *
     * @param {Number} degree
     */
    rotateTo: function (degree) {
      degree = num(degree);

      if (isNumber(degree) && this.isBuilt && !this.isDisabled && this.options.rotatable) {
        this.image.rotate = degree % 360;
        this.isRotated = true;
        this.renderCanvas(true);
      }
    },

    /**
     * Scale the image
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
     *
     * @param {Number} scaleX
     * @param {Number} scaleY (optional)
     */
    scale: function (scaleX, scaleY) {
      var image = this.image;
      var isChanged = false;

      // If "scaleY" is not present, its default value is "scaleX"
      if (isUndefined(scaleY)) {
        scaleY = scaleX;
      }

      scaleX = num(scaleX);
      scaleY = num(scaleY);

      if (this.isBuilt && !this.isDisabled && this.options.scalable) {
        if (isNumber(scaleX)) {
          image.scaleX = scaleX;
          isChanged = true;
        }

        if (isNumber(scaleY)) {
          image.scaleY = scaleY;
          isChanged = true;
        }

        if (isChanged) {
          this.renderImage(true);
        }
      }
    },

    /**
     * Scale the abscissa of the image
     *
     * @param {Number} scaleX
     */
    scaleX: function (scaleX) {
      var scaleY = this.image.scaleY;

      this.scale(scaleX, isNumber(scaleY) ? scaleY : 1);
    },

    /**
     * Scale the ordinate of the image
     *
     * @param {Number} scaleY
     */
    scaleY: function (scaleY) {
      var scaleX = this.image.scaleX;

      this.scale(isNumber(scaleX) ? scaleX : 1, scaleY);
    },

    /**
     * Get the cropped area position and size data (base on the original image)
     *
     * @param {Boolean} isRounded (optional)
     * @return {Object} data
     */
    getData: function (isRounded) {
      var options = this.options;
      var image = this.image;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
      var ratio;
      var data;

      if (this.isBuilt && this.isCropped) {
        data = {
          x: cropBox.left - canvas.left,
          y: cropBox.top - canvas.top,
          width: cropBox.width,
          height: cropBox.height
        };

        ratio = image.width / image.naturalWidth;

        $.each(data, function (i, n) {
          n = n / ratio;
          data[i] = isRounded ? round(n) : n;
        });

      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      if (options.rotatable) {
        data.rotate = image.rotate || 0;
      }

      if (options.scalable) {
        data.scaleX = image.scaleX || 1;
        data.scaleY = image.scaleY || 1;
      }

      return data;
    },

    /**
     * Set the cropped area position and size with new data
     *
     * @param {Object} data
     */
    setData: function (data) {
      var options = this.options;
      var image = this.image;
      var canvas = this.canvas;
      var cropBoxData = {};
      var isRotated;
      var isScaled;
      var ratio;

      if ($.isFunction(data)) {
        data = data.call(this.element);
      }

      if (this.isBuilt && !this.isDisabled && $.isPlainObject(data)) {
        if (options.rotatable) {
          if (isNumber(data.rotate) && data.rotate !== image.rotate) {
            image.rotate = data.rotate;
            this.isRotated = isRotated = true;
          }
        }

        if (options.scalable) {
          if (isNumber(data.scaleX) && data.scaleX !== image.scaleX) {
            image.scaleX = data.scaleX;
            isScaled = true;
          }

          if (isNumber(data.scaleY) && data.scaleY !== image.scaleY) {
            image.scaleY = data.scaleY;
            isScaled = true;
          }
        }

        if (isRotated) {
          this.renderCanvas();
        } else if (isScaled) {
          this.renderImage();
        }

        ratio = image.width / image.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvas.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvas.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }
    },

    /**
     * Get the container size data
     *
     * @return {Object} data
     */
    getContainerData: function () {
      return this.isBuilt ? this.container : {};
    },

    /**
     * Get the image position and size data
     *
     * @return {Object} data
     */
    getImageData: function () {
      return this.isLoaded ? this.image : {};
    },

    /**
     * Get the canvas position and size data
     *
     * @return {Object} data
     */
    getCanvasData: function () {
      var canvas = this.canvas;
      var data = {};

      if (this.isBuilt) {
        $.each([
          'left',
          'top',
          'width',
          'height',
          'naturalWidth',
          'naturalHeight'
        ], function (i, n) {
          data[n] = canvas[n];
        });
      }

      return data;
    },

    /**
     * Set the canvas position and size with new data
     *
     * @param {Object} data
     */
    setCanvasData: function (data) {
      var canvas = this.canvas;
      var aspectRatio = canvas.aspectRatio;

      if ($.isFunction(data)) {
        data = data.call(this.$element);
      }

      if (this.isBuilt && !this.isDisabled && $.isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvas.left = data.left;
        }

        if (isNumber(data.top)) {
          canvas.top = data.top;
        }

        if (isNumber(data.width)) {
          canvas.width = data.width;
          canvas.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvas.height = data.height;
          canvas.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }
    },

    /**
     * Get the crop box position and size data
     *
     * @return {Object} data
     */
    getCropBoxData: function () {
      var cropBox = this.cropBox;
      var data;

      if (this.isBuilt && this.isCropped) {
        data = {
          left: cropBox.left,
          top: cropBox.top,
          width: cropBox.width,
          height: cropBox.height
        };
      }

      return data || {};
    },

    /**
     * Set the crop box position and size with new data
     *
     * @param {Object} data
     */
    setCropBoxData: function (data) {
      var cropBox = this.cropBox;
      var aspectRatio = this.options.aspectRatio;
      var isWidthChanged;
      var isHeightChanged;

      if ($.isFunction(data)) {
        data = data.call(this.$element);
      }

      if (this.isBuilt && this.isCropped && !this.isDisabled && $.isPlainObject(data)) {

        if (isNumber(data.left)) {
          cropBox.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBox.top = data.top;
        }

        if (isNumber(data.width)) {
          isWidthChanged = true;
          cropBox.width = data.width;
        }

        if (isNumber(data.height)) {
          isHeightChanged = true;
          cropBox.height = data.height;
        }

        if (aspectRatio) {
          if (isWidthChanged) {
            cropBox.height = cropBox.width / aspectRatio;
          } else if (isHeightChanged) {
            cropBox.width = cropBox.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }
    },

    /**
     * Get a canvas drawn the cropped image
     *
     * @param {Object} options (optional)
     * @return {HTMLCanvasElement} canvas
     */
    getCroppedCanvas: function (options) {
      var originalWidth;
      var originalHeight;
      var canvasWidth;
      var canvasHeight;
      var scaledWidth;
      var scaledHeight;
      var scaledRatio;
      var aspectRatio;
      var canvas;
      var context;
      var data;

      if (!this.isBuilt || !this.isCropped || !SUPPORT_CANVAS) {
        return;
      }

      if (!$.isPlainObject(options)) {
        options = {};
      }

      data = this.getData();
      originalWidth = data.width;
      originalHeight = data.height;
      aspectRatio = originalWidth / originalHeight;

      if ($.isPlainObject(options)) {
        scaledWidth = options.width;
        scaledHeight = options.height;

        if (scaledWidth) {
          scaledHeight = scaledWidth / aspectRatio;
          scaledRatio = scaledWidth / originalWidth;
        } else if (scaledHeight) {
          scaledWidth = scaledHeight * aspectRatio;
          scaledRatio = scaledHeight / originalHeight;
        }
      }

      // The canvas element will use `Math.floor` on a float number, so floor first
      canvasWidth = floor(scaledWidth || originalWidth);
      canvasHeight = floor(scaledHeight || originalHeight);

      canvas = $('<canvas>')[0];
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context = canvas.getContext('2d');

      if (options.fillColor) {
        context.fillStyle = options.fillColor;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
      context.drawImage.apply(context, (function () {
        var source = getSourceCanvas(this.$clone[0], this.image);
        var sourceWidth = source.width;
        var sourceHeight = source.height;
        var args = [source];

        // Source canvas
        var srcX = data.x;
        var srcY = data.y;
        var srcWidth;
        var srcHeight;

        // Destination canvas
        var dstX;
        var dstY;
        var dstWidth;
        var dstHeight;

        if (srcX <= -originalWidth || srcX > sourceWidth) {
          srcX = srcWidth = dstX = dstWidth = 0;
        } else if (srcX <= 0) {
          dstX = -srcX;
          srcX = 0;
          srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
        } else if (srcX <= sourceWidth) {
          dstX = 0;
          srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
        }

        if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
          srcY = srcHeight = dstY = dstHeight = 0;
        } else if (srcY <= 0) {
          dstY = -srcY;
          srcY = 0;
          srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
        } else if (srcY <= sourceHeight) {
          dstY = 0;
          srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
        }

        // All the numerical parameters should be integer for `drawImage` (#476)
        args.push(floor(srcX), floor(srcY), floor(srcWidth), floor(srcHeight));

        // Scale destination sizes
        if (scaledRatio) {
          dstX *= scaledRatio;
          dstY *= scaledRatio;
          dstWidth *= scaledRatio;
          dstHeight *= scaledRatio;
        }

        // Avoid "IndexSizeError" in IE and Firefox
        if (dstWidth > 0 && dstHeight > 0) {
          args.push(floor(dstX), floor(dstY), floor(dstWidth), floor(dstHeight));
        }

        return args;
      }).call(this));

      return canvas;
    },

    /**
     * Change the aspect ratio of the crop box
     *
     * @param {Number} aspectRatio
     */
    setAspectRatio: function (aspectRatio) {
      var options = this.options;

      if (!this.isDisabled && !isUndefined(aspectRatio)) {

        // 0 -> NaN
        options.aspectRatio = max(0, aspectRatio) || NaN;

        if (this.isBuilt) {
          this.initCropBox();

          if (this.isCropped) {
            this.renderCropBox();
          }
        }
      }
    },

    /**
     * Change the drag mode
     *
     * @param {String} mode (optional)
     */
    setDragMode: function (mode) {
      var options = this.options;
      var croppable;
      var movable;

      if (this.isLoaded && !this.isDisabled) {
        croppable = mode === ACTION_CROP;
        movable = options.movable && mode === ACTION_MOVE;
        mode = (croppable || movable) ? mode : ACTION_NONE;

        this.$dragBox.
          data(DATA_ACTION, mode).
          toggleClass(CLASS_CROP, croppable).
          toggleClass(CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {

          // Sync drag mode to crop box when it is not movable(#300)
          this.$face.
            data(DATA_ACTION, mode).
            toggleClass(CLASS_CROP, croppable).
            toggleClass(CLASS_MOVE, movable);
        }
      }
    }
  };

  Cropper.DEFAULTS = {

    // Define the view mode of the cropper
    viewMode: 0, // 0, 1, 2, 3

    // Define the dragging mode of the cropper
    dragMode: 'crop', // 'crop', 'move' or 'none'

    // Define the aspect ratio of the crop box
    aspectRatio: NaN,

    // An object with the previous cropping result data
    data: null,

    // A jQuery selector for adding extra containers to preview
    preview: '',

    // Re-render the cropper when resize the window
    responsive: true,

    // Restore the cropped area after resize the window
    restore: true,

    // Check if the current image is a cross-origin image
    checkCrossOrigin: true,

    // Check the current image's Exif Orientation information
    checkOrientation: true,

    // Show the black modal
    modal: true,

    // Show the dashed lines for guiding
    guides: true,

    // Show the center indicator for guiding
    center: true,

    // Show the white modal to highlight the crop box
    highlight: true,

    // Show the grid background
    background: true,

    // Enable to crop the image automatically when initialize
    autoCrop: true,

    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,

    // Enable to move the image
    movable: true,

    // Enable to rotate the image
    rotatable: true,

    // Enable to scale the image
    scalable: true,

    // Enable to zoom the image
    zoomable: true,

    // Enable to zoom the image by dragging touch
    zoomOnTouch: true,

    // Enable to zoom the image by wheeling mouse
    zoomOnWheel: true,

    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,

    // Enable to move the crop box
    cropBoxMovable: true,

    // Enable to resize the crop box
    cropBoxResizable: true,

    // Toggle drag mode between "crop" and "move" when click twice on the cropper
    toggleDragModeOnDblclick: true,

    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,

    // Shortcuts of events
    build: null,
    built: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
  };

  Cropper.setDefaults = function (options) {
    $.extend(Cropper.DEFAULTS, options);
  };

  Cropper.TEMPLATE = (
    '<div class="cropper-container">' +
      '<div class="cropper-wrap-box">' +
        '<div class="cropper-canvas"></div>' +
      '</div>' +
      '<div class="cropper-drag-box"></div>' +
      '<div class="cropper-crop-box">' +
        '<span class="cropper-view-box"></span>' +
        '<span class="cropper-dashed dashed-h"></span>' +
        '<span class="cropper-dashed dashed-v"></span>' +
        '<span class="cropper-center"></span>' +
        '<span class="cropper-face"></span>' +
        '<span class="cropper-line line-e" data-action="e"></span>' +
        '<span class="cropper-line line-n" data-action="n"></span>' +
        '<span class="cropper-line line-w" data-action="w"></span>' +
        '<span class="cropper-line line-s" data-action="s"></span>' +
        '<span class="cropper-point point-e" data-action="e"></span>' +
        '<span class="cropper-point point-n" data-action="n"></span>' +
        '<span class="cropper-point point-w" data-action="w"></span>' +
        '<span class="cropper-point point-s" data-action="s"></span>' +
        '<span class="cropper-point point-ne" data-action="ne"></span>' +
        '<span class="cropper-point point-nw" data-action="nw"></span>' +
        '<span class="cropper-point point-sw" data-action="sw"></span>' +
        '<span class="cropper-point point-se" data-action="se"></span>' +
      '</div>' +
    '</div>'
  );

  // Save the other cropper
  Cropper.other = $.fn.cropper;

  // Register as jQuery plugin
  $.fn.cropper = function (option) {
    var args = toArray(arguments, 1);
    var result;

    this.each(function () {
      var $this = $(this);
      var data = $this.data(NAMESPACE);
      var options;
      var fn;

      if (!data) {
        if (/destroy/.test(option)) {
          return;
        }

        options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
        $this.data(NAMESPACE, (data = new Cropper(this, options)));
      }

      if (typeof option === 'string' && $.isFunction(fn = data[option])) {
        result = fn.apply(data, args);
      }
    });

    return isUndefined(result) ? this : result;
  };

  $.fn.cropper.Constructor = Cropper;
  $.fn.cropper.setDefaults = Cropper.setDefaults;

  // No conflict
  $.fn.cropper.noConflict = function () {
    $.fn.cropper = Cropper.other;
    return this;
  };

});

$(document).ready(function() {

	var dev = $('#hiddendata #environnementMode').text() == "dev";
	// var dev = false;
	// loading
	var loading = false;
	var croppername = '_cropper';

	$('form .cropper-block').each(function(e) {

		/*******************************/
		/* VARIABLES / INITIALISATION  */
		/*******************************/

		if(dev) console.log('• Loading :', 'Cropper-image / mode : '+$('#hiddendata #environnementMode').text()+" "+dev);
		// load icon
		var loadbutton = $('.loadOff', this);
		var loadingbutton = $('.loadOn', this);
		// fichier en cours
		var actualFile = null;

		// ID
		var cropperId = "#" + $(this).attr('id').replace(new RegExp("(" + croppername + ")$", "g"), '');
		// form name
		var fieldName = $(this).attr('data-form-name');
		// URL for ajax send
		var URLrawfile = $('span.cropper-send-rawfile', this).first().attr('data-send');
		// all other cropper data
		var cropperData = $.parseJSON($('span.cropper-info', this).first().attr('data-cropper'));

		/**
		 * Initialise les données de base
		 */
		var data = {
			height: 0,
			width: 0,
			ratioIndex: 0,
			file: {
				type: null,
				name: null,
				size: null,
			},
			removeImage: false,
			dataType: 'cropper',
			rawfiles: {
				actual: null,
				list: new Array(),
			},
		};

		/**
		 * Met à jour les données data
		 */
		var updateBoard = function(e) {
			$(cropperId).data('infoForPersist', data);
			if(dev) console.log('infoForPersist', $(cropperId).data('infoForPersist'));
		};

		// ratio
		if(cropperData.format.length > 0) {
			var ratio = new Array();
			if(cropperData.format.x != undefined && cropperData.format.y != undefined) {
				// un seul format
				ratio.push(cropperData.format[0] / cropperData.format[1]);
			} else {
				// tableau de formats
				for(var i = 0; i < cropperData.format.length; i++) {
					if(parseInt(cropperData.ratioIndex) == i) {
						data.ratioIndex = parseInt(cropperData.ratioIndex);
						updateBoard();
					}
					if(cropperData.format[i] == null) {
						ratio.push(null);
					} else if(cropperData.format[i].length > 1) {
						ratio.push(cropperData.format[i][0] / cropperData.format[i][1]);
					}
				};
			}
		};
		if(ratio == undefined) var ratio = new Array(null);

		// fields for copy name
		var fieldForCopy = new Array();
		for(var i = 0; i < cropperData.filenameCopy.length; i++) {
			copyField = cropperId.replace(new RegExp("(_" + fieldName + ")$", "g"), '_' + cropperData.filenameCopy[i]);
			if($(copyField).length) fieldForCopy.push($(copyField));
		};
		// Info for persist
		var infoForPersist = cropperId.replace(new RegExp("(_" + fieldName + ")$", "g"), '_infoForPersist');
		$(cropperId).data('infoForPersist_field', infoForPersist);

		var $inputImage = $(cropperId + '_fileInput');
		var $image = $(cropperId + '_image');
		var $previews = $('.img-preview', this);
		var $cropButtons = $('.docs-buttons button[data-method]', this);
		var $contImageNotNull = $('.containerImageNull', this);
		var $suppImage = $('.noImage', this);
		var $contFile = $('.container-actions', this);


		/*******************************/
		/* DEV LOGS                    */
		/*******************************/

		if(dev) {
			console.log('cropperId :', cropperId);
			console.log('fieldName :', fieldName);
			console.log('URLrawfile :', URLrawfile);
			console.log('infoForPersist_field :', infoForPersist);
			console.log('fieldForCopy :', fieldForCopy.length);
			console.log('format :', ratio);
			console.log('Accept :', cropperData.accept);
			console.log('Init :', cropperData.init);
		};


		/*******************************/
		/* AFFICHAGES                  */
		/*******************************/

		// Deletable
		if(cropperData.deletable == undefined) {
			cropperData.deletable = false;
			$('.noImage', this).remove();
		};

		/**
		 * Copie le nom du fichier les champs désignés (cropperData.filenameCopy)
		 * @param string name
		 */
		var updateFilenameCopy = function(fields) {
			if(fields == undefined) fields = fieldForCopy;
			if(actualFile != null) var name = actualFile.name;
			else var name = '';
			for(var i = 0; i < fields.length; i++) fields[i].val(name);
		};

		/**
		 * Mise à jour des éléments graphiques selon la présence ou non d'une image
		 * @return boolean
		 */
		var updateIfIsPicture = function() {
			var value = $image.attr('src');
			if(value == "#" || value == '') {
				$contImageNotNull.addClass('hidden');
				data.removeImage = true;
				return true;
			} else {
				$contImageNotNull.removeClass('hidden');
				data.removeImage = false;
				return false;
			}
		};
		// initialize…
		// updateIfIsPicture();

		/**
		 * Affichge on/off du mode "en cours de chargement"
		 * @param boolean statut
		 */
		var setLoading = function(statut) {
			if(statut == true) {
				$(loadbutton).addClass('hidden');
				$(loadingbutton).removeClass('hidden');
			} else {
				$(loadingbutton).addClass('hidden');
				$(loadbutton).removeClass('hidden');
			}
			loading = statut;
		};

		/**
		 * Initialise les vues preview
		 * @param object elem
		 */
		var initPreviews = function(elem) {
			var elem = elem;
			elem.css({
				display: 'block',
				width: '100%',
				minWidth: 0,
				minHeight: 0,
				maxWidth: 'none',
				maxHeight: 'none',
			}).addClass('img-responsive');
			$previews.css({
				width: '100%',
				overflow: 'hidden',
			}).addClass('img-rounded').html(elem);
		};



		/*******************************/
		/* CROPPER                     */
		/*******************************/

		var cropperOptions = {
			aspectRatio: ratio[data.ratioIndex],
			preview: cropperId + croppername + " .img-preview",
			autoCropArea: 1.0, 
			responsive: true,
			restore: true,
			viewMode: 2,
			movable: false,
			// rotatable: false,
			// scalable: false,
			// zoomable: false,
			zoomOnTouch: false,
			zoomOnWheel: false,
			wheelZoomRatio: false,
			cropBoxMovable: true,
			// cropBoxResizable: false,
			toggleDragModeOnDblclick: false,
			build: function(e) {
				initPreviews($(this).clone());
			},
			crop: function(e) {
				var imageData = $(this).cropper('imageData');
				var previewAspectRatio = e.width / e.height;
				if(dev) console.log('imageData : ', imageData);
				data.width = imageData.context.naturalWidth;
				data.height = imageData.context.naturalHeight;
				updateBoard();
				$previews.each(function() {
					var $preview = $(this);
					var previewWidth = $preview.width();
					var previewHeight = previewWidth / previewAspectRatio;
					var imageScaledRatio = e.width / previewWidth;
					$preview.height(previewHeight).find('img').css({
						width: imageData.context.naturalWidth / imageScaledRatio,
						height: imageData.context.naturalHeight / imageScaledRatio,
						marginLeft: -e.x / imageScaledRatio,
						marginTop: -e.y / imageScaledRatio,
					});
				});
			},
		};

		$image.one('built.cropper', function(e) {
			if(cropperData.init != undefined && cropperData.init != null) {
				$image.cropper('setData', cropperData.init);
				cropperData.init = null;
			};
			updateIfIsPicture();
		});
		if($image.attr('src') != "#" && $image.attr('src') != '') {
			$contImageNotNull.removeClass('hidden');
			$image.cropper(cropperOptions);
		} else {
			updateIfIsPicture();
		};

		// Import image
		var URL = (window.URL || window.webkitURL);
		var blobURL;
		if(URL) {
			$inputImage.on('change', function() {
				var files = this.files;
				var file;
				// if(!$image.data('cropper')) {
				//     return;
				// }
				if(files && files.length) {
					file = files[0];
					reg = new RegExp('^image\/', 'gi');
					test = reg.test(file.type);
					if(dev) console.log('Format file test : ', file.type + ' = ' + test);
					if(test) {
						// alert("Fichier : " + files.length + "\nType : " + file.type + "\nTaille : " + file.size + "\nNom : " + file.name);
						if(file.size < (cropperData.maxfilesize * 1000000)) {
							var olddata = $.extend({}, data);
							data.file = {
								type: file.type,
								name: file.name,
								size: file.size,
							};
							setLoading(true);
							var charge = new FileReader();
							charge.readAsDataURL(file);
							charge.onloadend = function(e) {
								actualFile = file;
								var send = $.extend({}, data);
								send.raw = e.target.result;
								$.ajax({
									method: "POST",
									url: URLrawfile,
									data: {
										'data': send
									},
								}).done(function(returnData) {
									returnData = $.parseJSON(returnData);
									if(returnData.result != true) {
										if(dev) alert('Une erreur est survenue lors de l\'enregistrement.\n-----------------------------\n'+returnData.message);
											else alert('Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer, SVP.\nAttention : un fichier corrompu, non conforme ou trop lourd (Max. ' + cropperData.maxfilesize + 'Mo) peut faire échouer l\'opération.');
										data = olddata;
										updateBoard();
									} else {
										$image.attr('src', returnData.data.image);
										$contImageNotNull.removeClass('hidden');
										if(data.rawfiles.actual != null) data.rawfiles.list.push(data.rawfiles.actual);
										data.rawfiles.actual = returnData.data.id;
										data.removeImage = false;
										updateBoard();
										updateFilenameCopy();
										$image.cropper('destroy').cropper(cropperOptions);
										// updateIfIsPicture();
									};
								}).fail(function(jqXHR, textStatus) {
									// if(dev) console.log("Error jqXHR : ", jqXHR);
									if(dev) {
										$('<div>'+jqXHR.responseText+'</div>').appendTo('body');
										alert('Fail : une erreur est survenue lors de l\'enregistrement. Veuillez recommencer, SVP.\nAttention : un fichier corrompu, non conforme ou trop lourd (Max. ' + cropperData.maxfilesize + 'Mo) peut faire échouer l\'opération.\n• Request failed '+jqXHR.status+' : ' + jqXHR.statusText);
									} else {
										alert('Fail : une erreur est survenue lors de l\'enregistrement. Veuillez recommencer, SVP.\nAttention : un fichier corrompu, non conforme ou trop lourd (Max. ' + cropperData.maxfilesize + 'Mo) peut faire échouer l\'opération.');
									}
									data = olddata;
									updateBoard();
								}).always(function() {
									setLoading(false);
									$inputImage.val('');
									updateIfIsPicture();
								});
							};
						} else {
							alert('Fichier trop lourd… vous devez choisir un fichier de moins de ' + cropperData.maxfilesize + 'Mo.');
						}
					} else {
						alert('Fichier de type ' + file.type + '.\nVous devez sélectionner un fichier de type image.');
					}
				};
			});
		} else {
			$inputImage.prop('disabled', true).parent().addClass('disabled');
		};



		/*******************************/
		/* EVENTS                      */
		/*******************************/

		/**
		 * EVENTS : bouton(s) suppression de l'image
		 */
		$suppImage.on('click', function(e) {
			e.preventDefault();
			$image.attr('src', '#');
			// data.removeImage = true;
			updateBoard();
			updateIfIsPicture();
		});

		/**
		 * EVENTS : methods for crop buttons
		 */
		$cropButtons.on('click', function() {
			var $this = $(this);
			var data = $this.data();
			var $target;
			var result;
			if($this.prop('disabled') || $this.hasClass('disabled')) {
				return;
			}
			if($image.data('cropper') && data.method) {
				data = $.extend({}, data); // Clone a new one
				if(typeof data.target !== 'undefined') {
					$target = $(data.target);
					if(typeof data.option === 'undefined') {
						try {
							data.option = JSON.parse($target.val());
						} catch(e) {
							if(dev) console.log(e.message);
						}
					}
				}
				result = $image.cropper(data.method, data.option, data.secondOption);
				switch(data.method) {
					case 'scaleX':
					case 'scaleY':
						$(this).data('option', -data.option);
						break;
				}
				if($.isPlainObject(result) && $target) {
					try {
						$target.val(JSON.stringify(result));
					} catch(e) {
						if(dev) console.log(e.message);
					}
				}
			}
		});

		/**
		 * EVENTS : methods for crop toggles
		 */
		$('.docs-toggles', this).on('change', 'input', function(e) {
			// e.preventDefault();
			// if (!$image.data('cropper')) return;
			var idx = parseInt($(this).attr('data-ratio-index'));
			if(idx != undefined) {
				data.ratioIndex = idx;
				updateBoard();
			}
			// cropperOptions.aspectRatio = ratio[parseInt($(this).val())];
			cropperOptions.aspectRatio = ratio[idx];
			if(cropperOptions.aspectRatio == undefined) cropperOptions.aspectRatio = null;
			$image.cropper('destroy').cropper(cropperOptions);
			// updateIfIsPicture();
		});

	});



	/*******************************/
	/* ON SUBMIT                   */
	/*******************************/

	var updateImageData = function(cropperId) {
		// var cropperId = cropperId;
		var $image = $(cropperId + '_image');
		// contenu imagee
		var data = $(cropperId).data('infoForPersist');
		data.getData = $image.cropper("getData");
		// Math.round
		data.getData.x = Math.round(data.getData.x);
		data.getData.y = Math.round(data.getData.y);
		data.getData.width = Math.round(data.getData.width);
		data.getData.height = Math.round(data.getData.height);
		// info file/size
		$($(cropperId).data('infoForPersist_field')).val(JSON.stringify(data));
	};

	var sub = false; // site_adminbundle_media
	// Download new image to crop
	$(document.body).on('submit', "form", function(e) {
		var $cropperBlock = $('.cropper-block', this);
		if($cropperBlock.length) {
			if(sub == false) {
				e.preventDefault();
				if(loading == false) {
					sub = true;
					$cropperBlock.each(function(e) {
						updateImageData("#" + $(this).attr('id').replace(new RegExp("(" + croppername + ")$", "g"), ''));
					});
					$(this).submit();
				} else {
					alert('Le chargement est toujours en cours, veuillez patienter, svp.');
				}
			}
		}
	});

});


/*! nouislider - 8.3.0 - 2016-02-14 17:37:19 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// Shorthand for stopPropagation so we don't have to create a dynamic method
	function stopPropagation ( e ) {
		e.stopPropagation();
	}

	// todo
	function addCssPrefix(cssPrefix) {
		return function(className) {
			return cssPrefix + className;
		};
	}


	var
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	defaultCssPrefix = 'noUi-';


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0,
			hover = entry.indexOf('hover') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		var i;

		if ( entry === false ) {
			return;
		} else if ( entry === true ) {

			parsed.tooltips = [];

			for ( i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}

		} else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider: must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' ) {
			throw new Error( "noUiSlider: 'cssPrefix' must be a string.");
		}

		parsed.cssPrefix = entry;
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		};

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options ){

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {},
		scope_Self;

  var cssClasses = [
    /*  0 */  'target'
    /*  1 */ ,'base'
    /*  2 */ ,'origin'
    /*  3 */ ,'handle'
    /*  4 */ ,'horizontal'
    /*  5 */ ,'vertical'
    /*  6 */ ,'background'
    /*  7 */ ,'connect'
    /*  8 */ ,'ltr'
    /*  9 */ ,'rtl'
    /* 10 */ ,'draggable'
    /* 11 */ ,''
    /* 12 */ ,'state-drag'
    /* 13 */ ,''
    /* 14 */ ,'state-tap'
    /* 15 */ ,'active'
    /* 16 */ ,''
    /* 17 */ ,'stacking'
    /* 18 */ ,'tooltip'
    /* 19 */ ,''
    /* 20 */ ,'pips'
    /* 21 */ ,'marker'
    /* 22 */ ,'value'
  ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		addClass(handle, cssClasses[3]);
		addClass(handle, cssClasses[3] + additions[index]);

		addClass(origin, cssClasses[2]);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, cssClasses[7]);
					addClass(handles[0], cssClasses[6]);
					break;
			case 3: addClass(handles[1], cssClasses[6]);
					/* falls through */
			case 2: addClass(handles[0], cssClasses[7]);
					/* falls through */
			case 0: addClass(target, cssClasses[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, cssClasses[0]);
		addClass(target, cssClasses[8 + direction]);
		addClass(target, cssClasses[4 + orientation]);

		var div = document.createElement('div');
		addClass(div, cssClasses[1]);
		target.appendChild(div);
		return div;
	}


	function addTooltip ( handle, index ) {

		if ( !options.tooltips[index] ) {
			return false;
		}

		var element = document.createElement('div');
		element.className = cssClasses[18];
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		if ( options.dir ) {
			options.tooltips.reverse();
		}

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		if ( options.dir ) {
			tips.reverse();
			options.tooltips.reverse();
		}

		bindEvent('update', function(f, o, r) {
			if ( tips[o] ) {
				tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
			}
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][options.ort],
			element = document.createElement('div'),
			out = '';

		addClass(element, cssClasses[20]);
		addClass(element, cssClasses[20] + '-' + style);

		function getSize( type ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1]) +
				'" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			out += '<div ' + getTags(offset, cssClasses[21], values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				out += '<div '+getTags(offset, cssClasses[22], values)+'>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});
		element.innerHTML = out;

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
		return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
	}

	// External event handling
	function fireEvent ( event, handleNumber, tap ) {

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {

					callback.call(
						// Use the slider public API as the scope ('this')
						scope_Self,
						// Return values as array, so arg_1[arg_2] is always valid.
						asArray(valueGet()),
						// Handle index, 0 or 1
						handleNumber,
						// Unformatted slider values
						asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))),
						// Event is fired by tap, true or false
						tap || false,
						// Left offset of the handle, in relation to the slider
						scope_Locations
					);
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, cssClasses[14]) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + cssClasses[15] ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, cssClasses[15]);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, cssClasses[12]);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		// If this is a standard handle movement, fire the end event.
		if ( data.handleNumber !== undefined ) {
			fireEvent('end', data.handleNumber);
		}
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			end ( event, data );
		}
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			addClass(data.handles[0].children[0], cssClasses[15]);

			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}
		}

		// Fix #551, where a handle gets selected instead of dragged.
		event.preventDefault();

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			handleNumber: data.handleNumber,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		var outEvent = attach("mouseout", d, documentLeave, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		d.noUiListeners = moveEvent.concat(endEvent, outEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, cssClasses[12]);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}

		if ( data.handleNumber !== undefined ) {
			fireEvent('start', data.handleNumber);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;
		
		// Check if handler is not disablet if yes set number to the next handler
		if (scope_Handles[handleNumber].hasAttribute('disabled')) {
			handleNumber = handleNumber ? 0 : 1;
		}

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber, true);
		fireEvent('set', handleNumber, true);
		fireEvent('change', handleNumber, true);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function hover ( event ) {

		var location = event.calcPoint - offset(scope_Base)[ options.style ],
			to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
			value = scope_Spectrum.fromStepping( to );

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < scope_Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, scope_Handles[i].children[0], start, {
					handles: [ scope_Handles[i] ],
					handleNumber: i
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attach ( actions.move, scope_Base, hover, { hover: true } );
			for ( i = 0; i < scope_Handles.length; i += 1 ) {
				['mousemove MSPointerMove pointermove'].forEach(function( eventName ){
					scope_Handles[i].children[0].addEventListener(eventName, stopPropagation, false);
				});
			}
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			drag = [scope_Base.querySelector( '.' + cssClasses[7] )];
			addClass(drag[0], cssClasses[10]);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move
		if ( to === scope_Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, cssClasses[17]);
			if ( to > 50 ) {
				addClass(handle, cssClasses[17]);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		var count, values = asArray( input ), i;

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {

			// Fire the event only for handles that received a new value, as per #579
			if ( values[i] !== null ) {
				fireEvent('set', i);
			}
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {

		cssClasses.forEach(function(cls){
			if ( !cls ) { return; } // Ignore empty classes
			removeClass(scope_Target, cls);
		});

		while (scope_Target.firstChild) {
			scope_Target.removeChild(scope_Target.firstChild);
		}

		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent.split('.')[0],
			namespace = namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, step, range, animate, snap
	function updateOptions ( optionsToUpdate ) {

		var v = valueGet(), i, newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate,
			snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
		});

		['margin', 'limit', 'step', 'range', 'animate'].forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = optionsToUpdate[name];
			}
		});

		// Save current spectrum direction as testOptions in testRange call
		// doesn't rely on current direction
		newOptions.spectrum.direction = scope_Spectrum.direction;
		scope_Spectrum = newOptions.spectrum;

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [-1, -1];
		valueSet(v);

		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('update', i);
		}
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions,
		options: options, // Issue #600
		target: scope_Target, // Issue #597
		pips: pips // Issue #594
	};

	// Attach user events.
	events( options.events );

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));