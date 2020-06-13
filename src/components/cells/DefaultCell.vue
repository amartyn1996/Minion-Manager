<template>
	<div 
		class="cell-style" 
		v-bind:style="{
			'cursor': cursor, 
			'height': cell_height, 
			'width': cell_width,
			'background-color': background_color, 
			'color': text_color
		}"
	>
		<div style="user-select: none;" v-bind:style="{'line-height': cell_height}">{{displayed_value}}</div>
	</div>
</template>

<script>
	export default {
		props: {
			is_hover: Boolean,
			cell_type: String,
			value: Object,
			cell_width: String,
			cell_height: String,
			background_color: String,
			text_color: String
		},
		data() {
			return {
				default_cursor_type: 'default'
			}
		},
		mounted() {

		},
		watch: {

		},
		computed: {
			displayed_value: function() {
				if (this.value == undefined) {
					return '';
				}
				return this.value.value != null ? this.value.value.value : 'null';
			},
			cursor: function() {
				if (this.value == undefined || this.value.value == undefined || this.value.value.cursor_type == undefined) {
					return this.default_cursor_type;
				}
				return this.value.value.cursor_type;
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.cell-style {

	}
</style>