<script>
  import tooltip from '../../../vue_shared/directives/tooltip';

  export default {
    directives: {
      tooltip,
    },
    props: {
      formState: {
        type: Object,
        required: true,
      },
      projectsAutocompleteUrl: {
        type: String,
        required: true,
      },
    },
    mounted() {
      const $moveDropdown = $(this.$refs['move-dropdown']);

      $moveDropdown.select2({
        ajax: {
          url: this.projectsAutocompleteUrl,
          quietMillis: 125,
          data(term, page, context) {
            return {
              search: term,
              offset_id: context,
            };
          },
          results(data) {
            const more = data.length >= 50;
            const context = data[data.length - 1] ? data[data.length - 1].id : null;

            return {
              results: data,
              more,
              context,
            };
          },
        },
        formatResult(project) {
          return project.name_with_namespace;
        },
        formatSelection(project) {
          return project.name_with_namespace;
        },
      })
      .on('change', (e) => {
        this.formState.move_to_project_id = parseInt(e.target.value, 10);
      });
    },
    beforeDestroy() {
      $(this.$refs['move-dropdown']).select2('destroy');
    },
  };
</script>

<template>
  <fieldset>
    <label
      for="issuable-move"
      class="sr-only">
      Move
    </label>
    <div class="issuable-form-select-holder append-right-5">
      <input
        ref="move-dropdown"
        type="hidden"
        id="issuable-move"
        data-placeholder="Move to a different project" />
    </div>
    <span
      v-tooltip
      data-placement="auto top"
      title="Moving an issue will copy the discussion to a different project and close it here. All participants will be notified of the new location.">
      <i
        class="fa fa-question-circle"
        aria-hidden="true">
      </i>
    </span>
  </fieldset>
</template>
