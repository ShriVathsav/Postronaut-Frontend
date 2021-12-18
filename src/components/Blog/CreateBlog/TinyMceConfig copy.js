export const textEditorConfig = (id, getContentFromEditor, addBorderToEditor) => {
    return {
        selector: `#${id}`, inline: true,
        plugins: 'print hr preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
        imagetools_cors_hosts: ['picsum.photos'],
        menubar: false,
        //automatic_uploads: false,
        toolbar: [
          'undo redo | bold italic underline | fontselect fontsizeselect hr', 
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

export const titleEditorConfig = (getContentFromEditor) => {
    return {
        selector: '#titleEditorId', inline: true,
        plugins: 'print imageupload link media template anchor insertdatetime advlist lists wordcount textpattern charmap quickbars emoticons',
        imagetools_cors_hosts: ['picsum.photos'],
        menubar: false,
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
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image imagetools table',
        skin: 'oxide',
        content_css: 'default',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup:function(ed) {
            ed.on('change', (e) => getContentFromEditor(e, ed));
            ed.on('drop', function(e) {
              console.log('The Editor has initialized.');
              e.preventDefault()
            })
        }, 
        file_picker_types: "image"
    }
}