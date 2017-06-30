import Service from './repo_service'
import Helper from './repo_helper'
import Vue from 'vue'
import Store from './repo_store'
import RepoPreviousDirectory from './repo_prev_directory'
import RepoFile from './repo_file'
import RepoMiniMixin from './repo_mini_mixin'

export default class RepoSidebar {
  constructor(url) {
    this.url = url;
    this.initVue();
    this.el = document.getElementById('ide');
  }

  initVue() {
    this.vue = new Vue({
      el: '#sidebar',
      mixins: [RepoMiniMixin],
      components: {
        'repo-previous-directory': RepoPreviousDirectory,
        'repo-file': RepoFile,
      },

      created() {
        this.addPopEventListener();
      },

      data: () => Store,

      methods: {
        addPopEventListener() {
          window.addEventListener('popstate', () => {
            this.linkClicked({
              url: location.href
            });
          });
        },

        linkClicked(file) {
          let url = '';
          if(typeof file === 'string'){
            // go back
            url = file;
          } else {
            url = file.url;
          }
          Service.url = url;
          if(typeof file === 'object') {
            if(file.type === 'tree' && file.opened) {
              Helper.removeChildFilesOfTree(file);
              return;
            }
            Helper.getContent(file);
          }
        }
      },
    });
  }
}