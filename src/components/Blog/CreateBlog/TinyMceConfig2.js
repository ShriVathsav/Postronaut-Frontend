export const textEditorConfig = (id, getContentFromEditor, addBorderToEditor, initialContent ) => {
    return {
        selector: `#${id}`, inline: true,
        //plugins: 'print hr preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
        plugons: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
        imagetools_cors_hosts: ['picsum.photos'],
        paste_as_text: true,
        menubar: false,
        //automatic_uploads: false,
        toolbar: [
          'undo redo | bold italic underline | fontselect fontsizeselect hr alignment', 
          'formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist',
          'forecolor backcolor | charmap emoticons | preview blockquote | image media link codesample subscript superscript'
        ],
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        importcss_append: true,
        toolbar_mode: 'floating',


        setup: function (editor) {

          /* example, adding a group toolbar button */
          editor.ui.registry.addGroupToolbarButton('alignment', {
            icon: 'align-left',
            tooltip: 'Alignment',
            items: 'alignleft aligncenter alignright | alignjustify'
          });
      
        },

        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: 600,
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image imagetools table',
        skin: 'oxide',
        content_css: 'default',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup:function(ed) {
            ed.on('change', (e) => getContentFromEditor(e, ed));
            ed.on('init', function (e) {
                ed.setContent(initialContent);
            })
            ed.on('NodeChange', function (e) {
              if(e.element.tagName === "IMG"){   
                console.log("FIRING NODECHANGE EVENT", e.element.getAttribute("style"), e.element)       
                console.dir(e.element)
                e.element.setAttribute("id", "24242");
                !e.element.getAttribute("style") && e.element.setAttribute("style", "max-width: 100%; height: auto;");
                //e.element.setAttribute("src", newSrc);
              }
            })
            ed.on('drop', function(e) {
              e.preventDefault()
            })
            ed.on('focus', function(e) {
              console.log('The Editor has DOCUS.');
              addBorderToEditor(true)
            })
            ed.on('blur', function(e) {
              console.log('The Editor has BLUR.');
              addBorderToEditor(false)
            })
        },
        image_dimensions: false,
          image_class_list: [
              {title: 'Responsive', value: 'img-responsive'}
        ],
        images_upload_url: 'postAcceptor.php',
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',

        /* we override default upload handler to simulate successful upload*/
        images_upload_handler: function (blobInfo, success, failure) {
            
                console.log(blobInfo.blob(), "BLOB INFO")
                /* no matter what you upload, we will turn it into TinyMCE logo :)*/
                success(URL.createObjectURL(blobInfo.blob()));
            
        }
    }
}

export const titleEditorConfig = (getContentFromEditor, initialContent) => {
    return {
        selector: '#titleEditorId', inline: true,
        plugins: 'link paste anchor insertdatetime advlist lists wordcount textpattern charmap quickbars emoticons',
        menubar: false,
        paste_as_text: true,
        toolbar: [
          'undo redo | bold italic underline | fontselect', 
          'forecolor backcolor | charmap emoticons | subscript superscript imageupload'
        ],
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        importcss_append: true,
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: 600,
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        noneditable_noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link',
        skin: 'oxide',
        content_css: 'default',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup:function(ed) {
            ed.on('change', (e) => getContentFromEditor(e, ed))
            ed.on('init', function (e) {
                ed.setContent(initialContent)
            })
            ed.on('drop', function(e) {
              console.log('The Editor has initialized.');
              e.preventDefault()
            })
        }, 
        file_picker_types: "image"
    }
}

export const blockquoteEditorConfig = (id, getContentFromEditor, addBorderToEditor, initialContent) => {
  return {
      selector: `#${id}`, inline: true,
      plugins: 'link paste anchor advlist lists wordcount textpattern charmap quickbars emoticons codesample',
      menubar: false, toolbar: false,
      paste_as_text: true,
      toolbar: [
        'undo redo | bold italic underline | fontselect forecolor backcolor | charmap emoticons | subscript superscript fontsizeselect'
      ],
      quickbars_insert_toolbar: 'quicktable image media codesample',
      image_advtab: true,
      importcss_append: true,
      template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
      template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
      height: 600,
      quickbars_selection_toolbar: 'undo redo | bold italic underline | fontselect forecolor backcolor | charmap emoticons | subscript superscript fontsizeselect',
      noneditable_noneditable_class: 'mceNonEditable',
      toolbar_mode: 'floating',
      contextmenu: 'link',
      skin: 'oxide',
      content_css: 'default',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

      setup:function(ed) {
          ed.on('change', (e) => getContentFromEditor(e, ed))
          ed.on('init', function (e) {
              ed.setContent(initialContent)
          })
          ed.on('drop', function(e) {
            console.log('The Editor has initialized.')
            e.preventDefault()
          })
          ed.on('focus', function(e) {
            console.log('The Editor has DOCUS.')
            addBorderToEditor(true)
          })
          ed.on('blur', function(e) {
            console.log('The Editor has BLUR.')
            addBorderToEditor(false)
          })
      }, 
  }
}

export const conf = {
  selector: '#editorId',
  menubar: false,
  //inline: true,
  plugins: [
    'link',
    'lists',
    'powerpaste',
    'autolink',
    'tinymcespellchecker'
  ],
  toolbar: [
    'undo redo | bold italic underline | fontselect fontsizeselect',
    'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
  ],
  valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
  valid_styles: {
    '*': 'font-size,font-family,color,text-decoration,text-align'
  },
  powerpaste_word_import: 'clean',
  powerpaste_html_import: 'clean',
}