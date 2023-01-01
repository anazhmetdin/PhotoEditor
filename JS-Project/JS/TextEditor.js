$(function() {
    // textsCount: total count of created and deleted texts
    // scale: resolution scale of canvas -> muliples of canvas dimensions
    var textsCount = 0, scale = 4, selectedText;
    
    var autoWidth = {}, autoHeight = {};
    
    var canvas = $('canvas');
    var layers = $('#texts');
    var layersList = $('#layersList');
    var textarea = $('#text');
    
    var ctx = canvas.get(0).getContext("2d");
    
    // set resolution
    canvas.width *= scale;
    canvas.height *= scale;
    
    // create new text object when button is clicked
    $('#new').click(function() {
        if (Number.parseInt(layers.css('width')) === 0) {return;}
        textsCount++;
    
        // layer name
        var newText = `text ${textsCount}`;
    
        // create list element
        var textLayer = $(`<li class="textLayer" id="l${textsCount}"><img src="../icons/text/dots.png">${newText}</li>`);
    
        // push name to layers list element
        layersList.prepend(textLayer);
    
        // make list item selects corresponding text
        textLayer.on('click', function(){
            activateTextAndLayer(getSelectedText(this.id), $(this));
        });
    
        // create new text element
        var newText = ( $(
            `<pre id="t${textsCount}" class="text" style="position:absolute; top:50%;
            left:50%; margin:0; user-select: none;
            ${
                !$('#overflowing').prop('checked') ?
                    
                `white-space: break-spaces;
                word-break: break-all;` :
    
                 ""
            }
            color: ${$('#color').val()}; text-align: ${$('.textAlignInput[name=text-align]:checked').val()};
            background-color: ${getBackgroundColor()};
            width: ${$('#autowidth').prop('checked') ? 'fit-content' : $('#width').val()+'px'};
            height: ${$('#autoheight').prop('checked') ? 'fit-content' : $('#height').val()+'px'};
            font-size:${$('#font-size').val()}px; padding:${$('#padding').val()}px;
            border-radius: ${$('#border-radius').val()}px;
            font-weight:${$('#bold').prop('checked') ? 'bold' : 'normal'};
            font-style:${$('#italic').prop('checked') ? 'italic' : 'normal'};
            ${$('#underline').prop('checked') ? 'text-decoration: underline' : ''};
            direction:${$('input[name=direction]:checked').val()};
            font-family:${$('#font-family').val()};">${newText}</pre>`) );
        
        // add new selected text element to HTML
        layers.append(newText);
    
        // set the new added element as the selected text
        // activate the corresponding layer
        activateTextAndLayer(newText, textLayer);

        // set z-index of new text
        var newIndex = layersList.children().length - layersList.index() + 1;
        selectedText.css('z-index', newIndex);
      
        // update width and height controller when text size changes
        resizeObserver.observe(selectedText[0]);
    
        // set auto-dimension for this text
        autoWidth[selectedText.attr('id')] = $('#autowidth').prop('checked');
        autoHeight[selectedText.attr('id')] = $('#autoheight').prop('checked');
    
        // add event listner to start moving
        selectedText.mousedown(selectingText);
    
        // remove evenet listner
        var stopMoving = function() { $(document).off('mousemove'); };
    
        // stop moving when mouse is up or has left the document
        $(document).mouseup(stopMoving);
        // $(document).mouseleave(stopMoving); // not working as expected
        
        // make sure text is within the box
        limitTextToBox();
    });
    
    
    // unselect text when canvas or non_text layer is clicked without a text being hovered
    $('.non_textLayer, #texts').mousedown(function(event) {
        if (!event.target.classList.contains('text')) {
            // get all elemets beneath mouse
            var pointedElements = document.elementsFromPoint(event.clientX, event.clientY);
            // is the selectedText beneath mouse
            var withSelected = false;
            // search in all targeted elements
            pointedElements.map(function(element) {
                // if the selected text is found
                if (element.classList.contains('text')) {
        
                    withSelected = true;
        
                    // create new event with current mouse position
                    const e = $.Event('mousedown', {
                        'clientX' : event.clientX, 
                        'clientY' : event.clientY
                    });
                    
                    // dispatch event on the selected text
                    $(element).trigger(e);
                    return;
                }
            });

            if (!withSelected && !!selectedText) {
                getSelectedLayer().removeClass('active_layer');
                selectedText.removeClass('selected_text');
                selectedText = null;
            }
        }

    });
    
    // event handler to select text on mouse down
    function selectingText(event) {

        if (currentSection != 3) {return;}
    
        if (!!selectedText) {
            // if the clicked text is the selected text
            if (!!selectedText && selectedText.attr('id') == this.id) {
                moveText(event);
                return;
            }
        
            // get all elemets beneath mouse
            var pointedElements = document.elementsFromPoint(event.clientX, event.clientY);
            // is the selectedText beneath mouse
            var withSelected = false;
            // search in all targeted elements
            pointedElements.map(function(element) {
                // if the selected text is found
                if (element.id == selectedText.attr('id')) {
        
                    withSelected = true;
        
                    // create new event with current mouse position
                    const e = $.Event('mousedown', {
                        'clientX' : event.clientX, 
                        'clientY' : event.clientY
                    });
                    
                    // dispatch event on the selected text
                    selectedText.trigger(e);
                    return;
                }
            });
        }
    
        // the old selected text is not found beneath mouse
        if (!withSelected) {
            // activate the target of this event and move it
            activateTextAndLayer($(event.target), getSelectedLayer(event.target.id));
            moveText(event);
        }
    }
    
    // event handler on mouse down to start moving
    function moveText(event) {
    
        // get layers dimensions
        var boxXOffset = layers.offset().left;
        var boxYOffset = layers.offset().top;
    
        // selectedText dimensions
        var textWidth = selectedText[0].getBoundingClientRect().width/2;
        var textHeight = selectedText[0].getBoundingClientRect().height/2;
        
        // offset from mousedown position to selectedText center
        var centerXOffset = event.clientX - selectedText.offset().left - textWidth;
        var centerYOffset = event.clientY - selectedText.offset().top - textHeight;
        
        // offset from mouse to selectedText inside box
        var xOffset = boxXOffset + textWidth + centerXOffset;
        var yOffset = boxYOffset + textHeight + centerYOffset;
        
        // update selectedText position when mouse moves
        $(document).mousemove(function(event) {

            selectedText.css('left', event.clientX-xOffset);
            selectedText.css('top', event.clientY-yOffset);
            limitTextToBox();
    
        })
    }
    
    // update text when textarea is updated
    textarea.on('input', function() {
    
        if (!!!selectedText) { return; }
    
        // update select text
        selectedText.text(this.value);
    
        // make sure text is within the box
        limitTextToBox();
    
        var text = this.value;
    
        // update layer text
        getSelectedLayer().map(function() {
            this.innerText = text === '' ? 'text #'+this.id.substring(1) : text;
        });
    })
    
    // set textarea value
    function setTextArea() {
        textarea.val(selectedText.text());
    }
    
    // make sure selected text doesn't pass the box
    function limitTextToBox() {// if text is allowed to overflow
        if (isOverflowing()) { return; }
        
        var selectedRect = selectedText[0].getBoundingClientRect();
        var layersRect   = layers[0].getBoundingClientRect();
        // check if text exceeds right border
        if (selectedRect.right > layersRect.right)
        {
            selectedText.css('left', `calc(100% - ${selectedRect.width}px)`);
        }
        // check if text exceeds left border
        if (selectedRect.left < layersRect.left)
        {
            selectedText.css('left', `0`);
        }
        // check if text exceeds bottom border
        if (selectedRect.bottom > layersRect.bottom)
        {
            selectedText.css('top', `calc(100% - ${selectedRect.height}px)`);
        }
        // check if text exceeds top border
        if (selectedRect.top < layersRect.top)
        {
            selectedText.css('top', `0`);
        }

        setWidthHeight();
    }
    
    // transform text id to layer id and vice versa
    function transfromID(letter, id) {
        // if id is not passed, use id of the selected text
        if(!!!id) {
            id = selectedText.attr('id');
        }
        return letter + id.substring(1);
    }
    
    // set text with index as the active text to be controlled
    function setLayerActive(textLayer) {
        // update textarea
        setTextArea();
        // set text in layer list as active
        highlightList(textLayer);
    }
    
    // set text in layer list as active
    function highlightList(textLayer) {
        // select active layer
        $('li[class~=active_layer]', layersList).removeClass('active_layer');
        // activate the passed argument
        if (arguments.length == 1) {
            textLayer.addClass('active_layer');
        } else { // activates the last added layer
            layers.children().first().addClass('active_layer');
        }
    }
    
    // set selected text
    function setTextActive(newSelectedText) {
        // if there is a selected text
        if (!!selectedText) { 
            selectedText.removeClass('selected_text');
        }
    
        selectedText = newSelectedText;
    
        selectedText.addClass('selected_text');
    }
    
    // activate Text and layer
    function activateTextAndLayer(text, layer) {
        setTextActive( text );
        setLayerActive( layer );
        matchSelectedStyle();
    }
    
    // match style options to the selected text
    function matchSelectedStyle() {
        // change font-family select to current font
        $('#font-family').val(selectedText.css('font-family'));
        
        // check bold if text is bold
        $('#bold').prop('checked', selectedText.css('font-weight') != 400);
        $('#italic').prop('checked', selectedText.css('font-style') != 'normal'); 
        $('#underline').prop('checked', selectedText.css('text-decoration').split(' ')[0] == 'underline');
    
        // change font size, padding, border-radius, width, height
        $('.pixels').map(function() {
            var value = Number.parseFloat(selectedText.css(this.id));
            this.value = Number.isFinite(value) ? value : 0;
        });
    
        // change color pickers to match selected text
        $('.text-color').map(function() {
            // get color without the alpha channel
            this.value = RGB2HEX(selectedText.css(this.name)).substring(0,7);
        });
    
        // change alph channel range
        $('#background-color-alpha').val(parseInt(RGB2HEX(selectedText.css('background-color')).substring(7).padStart(2, 'f'), 16));
    
        // match overflowing
        $('#overflowing').prop('checked', isOverflowing());
    
        // match text-align and direction
        $('.textAlignInput').prop('checked', false);
        $('#'+selectedText.css('text-align')+'Align').prop('checked', true);
        $('#'+selectedText.css('direction')).prop('checked', true);
    
        // match auto-dimension
        $('#autowidth').prop('checked', autoWidth[selectedText.attr('id')]);
        $('#autoheight').prop('checked', autoHeight[selectedText.attr('id')]);
    }

    // function to delete text
    function deleteText (text) {
        // remove the corresponding layer element
        getSelectedLayer(text.attr('id')).remove();
        // remove the text element
        text.remove();
        // erase text entries
        autoHeight[text.attr('id')] = undefined;
        autoWidth[text.attr('id')] = undefined;
    }

    // custom evant handler to delete all text elements
    $('#delete').on('deleteAll', function() {
        // loop over text elements and delete them
        $('.text').map(function(index, elelemnt) {
            deleteText($(elelemnt));
        });
    });
    
    // delete the selected text and its layer
    $('#delete').click(function (){
        if (!!selectedText) {
            deleteText(selectedText);
            selectedText = null;
        }
    });
    
    // style font when checkbox label is clicked
    $('.textStyle').click(function() {  
        if (!!!selectedText) { return; }
    
        var checkbox = $('#'+this.htmlFor);
        
        // apply font if checkbox is checked
        if (!checkbox[0].checked) { selectedText.css(checkbox.attr('name'), checkbox.val()); }
        else { selectedText.css(checkbox.attr('name'), ''); } // else remove style
    
        // make sure text is within the box
        limitTextToBox();
    });
    
    // font family changer
    $('#font-family').change(function() {
        if (!!! selectedText) { return; }
    
        selectedText.css('font-family', this.value);
    
        // make sure text is within the box
        limitTextToBox();
    });
    
    // font-size, padding, border-radius, width, height changer
    $('.pixels').change(function() {
        if (!!! selectedText) { return; }
    
        // change any css except for width and height when auto dimension is checked
        if ((this.id != 'width' && this.id != 'height') || !$('#auto'+this.id).prop('checked')) {
            selectedText.css(this.id, this.value+'px');
        }
    
        // make sure text is within the box
        limitTextToBox();
    });
    
    function RGB2HEX(rgb) {
        // if rgb contains alpha channel
        if (rgb.match('rgba') != null) {
            // split each channel
            return `#${rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0.]{0,2}\d+)\)$/).slice(1).map(function(n, i) {
                // multiply alpha[0->1] by 255
                if (i == 3) {n *= 255}
                // convert 0->255 to hex
                return parseInt(n, 10).toString(16).padStart(2, '0');
            }).join('')}`;
        } else if (rgb.match('rgb') != null){ // if rgb doesn't have alpha
            return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
        } else {
            return rgb;
        }
    }
    
    // font color changer
    $('.text-color').on('input', function() {
        if (!!! selectedText) { return; }
    
        // chosen color
        var val = this.value;
    
        // chosen color plus alpha channel
        if (this.name == 'background-color') {
            val = getBackgroundColor();
        }
    
        selectedText.css(this.name, val);
    });
    
    // overflowing checkbox change listener
    $('#overflowing').change(function() {
        // if not overflowing
        if (!this.checked) {
            // make selected text wrapped
            selectedText.css({'white-space': 'break-spaces', 'word-break': 'break-all'});
            limitTextToBox();
        } else {
            // make text not wrapable
            selectedText.css({'white-space': '', 'word-break': ''});
        }
    });
    
    // when alpha channel changes
    $('#background-color-alpha').on('input', function() {
        if (!!! selectedText) { return; }
        // update background color with the selected color
        selectedText.css('background-color', getBackgroundColor());
    });
    
    // combine background color from input
    function getBackgroundColor() {
        // get input background color
        var bgColor = $('#background-color').val();
        // extract HEX alpha value from input
        var alphaHex = parseInt($('#background-color-alpha').val()).toString(16).padStart(2, '0');
    
        return bgColor+alphaHex;
    }
    
    // get whether the selected text is overflowing or not
    function isOverflowing() {
        if (!!! selectedText) { return; }
        return selectedText.css('white-space') != 'break-spaces';
    }
    
    // text-align and direction
    $('.textAlignInput').change(function() {
        // cancel all related buttons
        $(`input[name=${this.name}]`).prop('checked', false);
        // activate this button only
        this.checked = true;
    });
    
    // auto-dimension checkbox
    $('.autoDimension').change(function() {
        
        if (!!! selectedText) { return; }
    
        // if auto dimension is checked
        if (this.checked) {
            // set the checked dimension as fit-content
            selectedText.css(this.value, 'fit-content');
        }
        else {
            // else, update the dimension of the selected text 
            selectedText.css(this.value, $('#'+this.value).val()+'px');
        }
    
        if (this.value == 'width') {
            autoWidth[selectedText.attr('id')] = this.checked;
        } else {
            autoHeight[selectedText.attr('id')] = this.checked;
        }
    
        // make sure text is within the box
        limitTextToBox();
    });
    
    // change width and height input automatically when the selected text is updated
    const resizeObserver = new ResizeObserver(setWidthHeight);

    function setWidthHeight() {
        // update width and height
        if (!!selectedText) {
            $('#width').val(Number.parseFloat(selectedText.css('width')));
            $('#height').val(Number.parseFloat(selectedText.css('height')));
        }
    }
    
    // make layers list sortable
    $("#layersList").sortable({
        placeholder: "active_layer", // styling class for placeholder
        
        stop: function(event, ui) { // callback when sorting finishes
            
            var parent = $(ui.item[0].parentElement);
            var length = parent.children().length
            
            // change z-index of corresponding layer
            parent.children().map(function(index, element) {
                var newIndex = length - index + 1;
                var corresponding;
                if (element.classList.contains('textLayer')) {
                    // if this elelemnt is text
                    corresponding = getSelectedText(element.id);
                } else {
                    corresponding = canvas;
                }
                corresponding.css('z-index', newIndex);
            });
        }
    });
    $("#layersList").disableSelection();
    
    function getSelectedLayer(id) {
        return $('#'+transfromID('l', id));
    }
    
    function getSelectedText(id) {
        return $('#'+transfromID('t', id));
    }

    // $('#texts').mousedown(function(event) {
    //     var pointedElements = document.elementsFromPoint(event.clientX, event.clientY);
    //     // search in all targeted elements
    //     console.log(event.target.id);

    //     pointedElements.map(function(element) {
    //         if (element.id == event.target.id) {return;}
    //         console.log(element);
    //         // create new event with current mouse position
    //         const e = $.Event('mousedown', {
    //             'clientX' : event.clientX, 
    //             'clientY' : event.clientY
    //         });
            
    //         // dispatch event on the selected text
    //         $(element).trigger(e);
    //     });
    // })
});