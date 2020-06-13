export const version = '0.1';

export const white = '#ffffff';
export const dark_grey = '#303030';
export const grey = '#404040';
export const light_grey = '#505050';
export const dark_green = '#204020';
export const green = '#306030';
export const light_green = '#407040';
export const red = '#603030';
export const light_red = '#704040';
export const purple = '#303060';
export const light_purple = '#404070';
export const orange = '#605030';
export const light_orange = '#706040';
export const blue = '#406070';
export const light_blue = '#42657a';
export const default_number_of_central_columns = 5;

export const checks = {
	'Strength Save': {type: "str"},
	'Dexterity Save': {type: "dex"},
	'Constitution Save': {type: "con"},
	'Intelligence Save': {type: "int"},
	'Wisdom Save': {type: "wis"},
	'Charisma Save': {type: "cha"},
	'Strength Check': {type: "str"},
	'Dexterity Check': {type: "dex"},
	'Constitution Check': {type: "con"},
	'Intelligence Check': {type: "int"},
	'Wisdom Check': {type: "wis"},
	'Charisma Check': {type: "cha"},
	'Acrobatics Check': {type: "dex"},
	'Animal Handling Check': {type: "wis"},
	'Arcana Check': {type: "int"},
	'Athletics Check': {type: "str"},
	'Deception Check': {type: "cha"},
	'History Check': {type: "int"},
	'Insight Check': {type: "wis"},
	'Intimidation Check': {type: "cha"},
	'Investigation Check': {type: "int"},
	'Medicine Check': {type: "wis"},
	'Nature Check': {type: "int"},
	'Perception Check': {type: "wis"},
	'Performance Check': {type: "cha"},
	'Persuasion Check': {type: "cha"},
	'Religion Check': {type: "int"},
	'Sleight of Hand Check': {type: "dex"},
	'Stealth Check': {type: "dex"},
	'Survival Check': {type: "wis"}
};

export const convert_check_to_variable_name = function(check) { //TODO: move this
	return check.replace(' ', '_').toLowerCase();
}

export const switch_on_roll_type = function(roll_type, normal_value, advantage_value, disadvantage_value) {
	switch(roll_type) {
		case 'Advantage':
			return advantage_value;
		case 'Disadvantage':
			return disadvantage_value;
		case 'Normal':
		default:
			return normal_value;
	}
}