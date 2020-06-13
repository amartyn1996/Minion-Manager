<template>
	<div 
		class="cell-style" 
		v-bind:style="{'height': cell_height, 'width': cell_width}"
		@mouseover="is_hover = true" 
		@mouseleave="is_hover = false"
		@click="handle_click"
	>
		<default-cell ref="default" v-if="cell_type == 'default' || value == undefined" 
			:cell_width="cell_width" 
			:cell_height="cell_height" 
			:value="value"
			:is_hover="is_hover"
			:background_color="background_color"
			:text_color="text_color"
			@input="update_model" >	
		</default-cell>
		<input-cell ref="input" v-else-if="cell_type == 'input'"
			:cell_width="cell_width"
			:cell_height="cell_height"
			:value="value"
			:is_hover="is_hover"
			:background_color="background_color"
			:text_color="text_color"
			@input="update_model">
		</input-cell>
		<select-cell ref="select" v-else-if="cell_type == 'select'"
			:cell_width="cell_width"
			:cell_height="cell_height"
			:value="value"
			:is_hover="is_hover"
			:background_color="background_color"
			:text_color="text_color"
			@input="update_model">
		</select-cell>
		<link-cell ref="link" v-if="cell_type == 'link'" 
			:cell_width="cell_width" 
			:cell_height="cell_height" 
			:value="value"
			:is_hover="is_hover"
			:background_color="background_color"
			:text_color="text_color"
			@input="update_model" >	
		</link-cell>
	</div>
</template>

<script>
	import DefaultCell from '@/components/cells/DefaultCell';
	import InputCell from '@/components/cells/InputCell';
	import SelectCell from '@/components/cells/SelectCell';
	import LinkCell from '@/components/cells/LinkCell';

	export default {
		components: {
			'default-cell': DefaultCell,
			'input-cell': InputCell,
			'select-cell': SelectCell,
			'link-cell': LinkCell
		},
		props: {
			value: Object,
			cell_type: String,
			cell_width: String,
			cell_height: String,
			default_background_color: String,
			default_text_color: String
		},
		data() {
			return {
				is_hover: false
			}
		},
		mounted() {

		},
		watch: {

		},
		computed: {
			background_color: function() {
				if (this.value == undefined) {
					return this.default_background_color;
				}
				let background_color = this.value.value.background_color == undefined ? this.default_background_color : this.value.value.background_color;
				if (this.is_hover) {
					return this.value.value.hover_background_color == undefined ? background_color : this.value.value.hover_background_color;
				} else {
					return background_color;
				}
			},
			text_color: function() {
				if (this.value == undefined) {
					return this.default_text_color;
				}
				let text_color = this.value.value.text_color == undefined ? this.default_text_color : this.value.value.text_color;
				if (this.is_hover) {
					return this.value.value.hover_text_color == undefined ? text_color : this.value.value.hover_text_color;
				} else {
					return text_color;
				}
			}
		},
		methods: {
			update_model() {
				this.value.value.updated = true;
				this.$emit('input');
			},
			handle_click() {
				if (this.value != undefined && this.value.value.is_toggleable == true) {
					this.value.value.click_state++;
					this.update_model();
				}
			}
		}
	}
</script>

<style scoped>
	.cell-style {

	}
</style>