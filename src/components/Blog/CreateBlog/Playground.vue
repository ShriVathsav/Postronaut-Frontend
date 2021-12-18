<template>
    <div id="playground" style="padding: 14px;">
        Text
    </div>
</template>

<script>

export default {
    name: "Playground",
    data(){
        return {

        }
    },
    methods: {

    },
    mounted() {
        tinymce.init({
            selector: '#playground',
  menubar: false,
  inline: true,
  plugins: [
    'autolink',
    'codesample',
    'link',
    'lists',
    'media',
    'powerpaste',
    'table',
    'image',
    'quickbars',
    'codesample',
    'help',
    'charmap', 'emoticons'
  ],
  toolbar: false,
  quickbars_insert_toolbar: 'quicktable image media codesample',
  quickbars_selection_toolbar: 'bold italic underline | formatselect | forecolor backcolor | fontselect | numlist bullist | charmap emoticons | subscript superscript quicklink | fontsizeselect | alignleft aligncenter alignright alignjustify',
  contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
  powerpaste_word_import: 'clean',
  powerpaste_html_import: 'clean',
        })
    }
}
</script>

<style scoped>

</style>