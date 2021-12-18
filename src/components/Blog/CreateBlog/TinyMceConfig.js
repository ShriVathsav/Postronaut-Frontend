export const textEditorConfig = (id, getContentFromEditor, addBorderToEditor, initialContent ) => {
    return {
        selector: `#${id}`,
        menubar: false,
        inline: true,
        plugins: 'autolink codesample link lists media table image quickbars codesample help charmap emoticons paste',
        //plugons: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
        toolbar: false,
        quickbars_insert_toolbar: 'quicktable image media codesample',
        quickbars_selection_toolbar: 'bold italic underline | formatselect | forecolor backcolor | fontselect | numlist bullist | charmap emoticons | subscript superscript quicklink | fontsizeselect | alignleft aligncenter alignright alignjustify',
        contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
        //powerpaste_word_import: 'clean',
        //powerpaste_html_import: 'clean',
        content_style: '.text-editor {font-size: 14px; line-height: 400%;} .text-editor p {margin: 28px 0px 0px 0px; padding: 0px;} .text-editor li {margin: 20px 0px 0px 0px; padding: 0px;} .text-editor ul, ol {margin: 28px 0px 0px 0px; padding: 0px 0px 0px 40px;}', //.text-editor li {margin: 20px 0px 0px 0px; padding: 0px;}',
        fontsize_formats: "8px 9px 10px 11px 12px 13px 14px 15px 16px",
        setup:function(ed) {
            //ed.dom.setAttrib(ed.dom.select('p'), 'para');
            ed.on('change', (e) => { 
                getContentFromEditor(e, ed)
            });
            ed.on('init', function () {
                ed.setContent(initialContent)
            })
            ed.on('drop', function(e) {
                e.preventDefault()
            })
            ed.on('focus', function() {
                console.log('The Editor has DOCUS.')
                addBorderToEditor(true)
            })
            ed.on('blur', function() {
                console.log('The Editor has BLUR.')
                addBorderToEditor(false)
            })
        },
    }
}


export const headingEditorConfig = (id, getContentFromEditor, addBorderToEditor, initialContent ) => {
    return {
        selector: `#${id}`,
        menubar: false,
        inline: true,
        plugins: ['autolink', 'codesample', 'link', 'lists', 'media', 'table', 'image',
            'quickbars', 'codesample', 'help', 'charmap', 'emoticons'
        ],
        toolbar: false,
        quickbars_insert_toolbar: 'quicktable image media codesample',
        quickbars_selection_toolbar: 'italic underline | formatselect | forecolor backcolor | fontselect | charmap emoticons | subscript superscript quicklink | fontsizeselect | alignleft aligncenter alignright alignjustify',
        contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',
        content_style: `.heading-editor {font-size: 22px; line-height: normal; font-weight: bold; display: 'inline-block';} .heading-editor p {margin: 28px 0px 0px 0px; padding: 0px;}`,
        fontsize_formats: "18px 20px 22px 24px 26px 28px",
        setup:function(ed) {
            ed.on('change', (e) => {
                console.log(id) 
                getContentFromEditor(e, ed)
            });
            ed.on('init', function () {
                ed.setContent(initialContent);
            })
            ed.on('keydown',function(e) {
                if(e.keyCode == 13){
                    e.preventDefault();
                }
            })
            ed.on('drop', function(e) {
              e.preventDefault()
            })
            ed.on('focus', function() {
              console.log('The Editor has DOCUS.');
              addBorderToEditor(true)
            })
            ed.on('blur', function() {
              console.log('The Editor has BLUR.');
              addBorderToEditor(false)
            })
        },
    }
}


export const titleEditorConfig = (getContentFromEditor, initialContent) => {
  return {
      selector: '#titleEditorId',
      menubar: false,
      inline: true,
      plugins: ['autolink', 'codesample', 'link', 'lists', 'media', 'table', 'image',
          'quickbars', 'help', 'charmap', 'emoticons'
      ],
      toolbar: false,
      quickbars_insert_toolbar: 'quicktable image media codesample',
      quickbars_selection_toolbar: 'bold italic underline formatselect | forecolor backcolor | fontselect | charmap emoticons | subscript superscript',
      contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',
      setup:function(ed) {
        ed.on('change', (e) => getContentFromEditor(e, ed));
        ed.on('init', function () {
            ed.setContent(initialContent);
        })
        ed.on('drop', function(e) {
          e.preventDefault()
        })
    },
  }
}


export const blockquoteEditorConfig = (id, getContentFromEditor, addBorderToEditor, initialContent) => {
    return {
        selector: `#${id}`,
        menubar: false,
        inline: true,
        plugins: ['autolink', 'codesample', 'link', 'lists', 'media', 'table', 'image',
            'quickbars', 'codesample', 'help', 'charmap', 'emoticons'
        ],
        toolbar: false,
        quickbars_selection_toolbar: 'bold italic underline | forecolor backcolor | fontselect | charmap emoticons | subscript superscript | fontsizeselect',
        contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
        fontsize_formats: "8px 9px 10px 11px 12px 13px 14px 15px 16px",
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',
        content_style: '.quote-editor {font-size: 14px; line-height: 400%;} .quote-editor p:first-child {margin: 0px;} .quote-editor p {margin: 28px 0px 0px 0px; padding: 0px;}',
        setup:function(ed) {
            ed.on('change', (e) => getContentFromEditor(e, ed))
            ed.on('init', function () {
                ed.setContent(initialContent)
            })
            ed.on('drop', function(e) {
              console.log('The Editor has initialized.')
              e.preventDefault()
            })
            ed.on('focus', function() {
              console.log('The Editor has DOCUS.')
              addBorderToEditor(true)
            })
            ed.on('blur', function() {
              console.log('The Editor has BLUR.')
              addBorderToEditor(false)
            })
        }, 
    }
}