<template>
  <div>
    <table>
      <tr>
        <td class="clickable-cell" style="min-width: 10vw;" @click="encodeData">Export as Base64</td>
        <td class="clickable-cell" style="min-width: 10vw;" @click="decodeData">Import as Base64</td>
        <td style="min-width: 70vw; text-align: left;"><input type="text" v-model="dataBase64" style=""></td>
      </tr>
    </table>
    <br/>
    <div class="clickable-cell" style="border: 1px solid black; max-width: 150px;" @click="toggleMode">{{data.mode + " mode"}}</div>
    <br/>
    <table>
        <tr>
          <td>Column Width</td>
          <td><input type="number" min="20" v-model="data.colWidth" style="max-width: 50px;"></td>
        </tr>
        <tr v-if="data.mode == 'normal'">
          <td>Check DC</td>
          <td><input type="number" v-model="data.checkDC" style="max-width: 50px;"></td>
        </tr>
        <tr v-if="data.mode == 'normal'">
          <td>Target AC</td>
          <td><input type="number" v-model="data.targetAC" style="max-width: 50px;"></td>
        </tr>
      </table>
    <div v-if="data.mode == 'normal'">
      <br/>
      <table>
        <tr>
          <td style="min-width: 300px;">
            <table>
              <tr>
                <td class="clickable-cell" @click="applyDamageToSelectedMinions(data.selectedDamage, data.shouldApplyDamageConditionally, data.damageCondition, data.noDamageOnConditionFail)" style="padding-right: 5px; border: none;">Apply Damage To Selected Minions</td>
                <td style="border-top: none; border-right: none; border-bottom: none;"><input type="number" v-model="data.selectedDamage" style="max-width: 70px;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="clickable-cell" @click="toggleConditionalDamage()">{{data.shouldApplyDamageConditionally ? 'Apply Damage Conditionally' : 'Always Apply Damage'}}</td>
        </tr>
        <tr v-show="data.shouldApplyDamageConditionally">
          <td class="clickable-cell" @click="toggleDamageCondition()">{{data.damageCondition}}</td>
        </tr>
        <tr v-show="data.shouldApplyDamageConditionally">
          <td class="clickable-cell" @click="toggleDamageExtent()">{{data.noDamageOnConditionFail ? 'No Damage if Condition is Not Met' : 'Half Damage if Condition is Not Met'}}</td>
        </tr>
      </table>
      <br/>
      <table>
        <tr>
          <td class="clickable-cell" style="max-width: 200px; padding: 3px;" @click="data.useNicknames = !data.useNicknames">{{data.useNicknames ? 'Showing Nicknames' : 'Showing Full Names'}}</td>
          <td class="clickable-cell" style="max-width: 200px; padding: 3px;" @click="toggleHideDead()">{{data.hideDead ? 'Hiding Dead' : 'Showing Dead'}}</td>
          <td class="clickable-cell" style="max-width: 200px; padding: 3px;" @click="data.showChecks = !data.showChecks">{{data.showChecks ? 'Showing Checks' : 'Hiding Checks'}}</td>
          <td class="clickable-cell active" style="max-width: 200px; padding: 3px;" @click="reroll">Roll The Dice</td>
        </tr>
      </table>
    </div>
    <br/>

    <table v-if="data.mode == 'normal'">

      <tr style="border: none;">
        <td v-for="i in getNumMinionColumns() + 1" :key="i" style="border: none;"></td>
        <td style="border: none;">{{getNumMinionColumns() + "/" + data.minions.length}}</td>
      </tr>

      <tr>
        <td>
          <table>
            <tr>
              <td class="minion-cell" style="min-width: 200px;">Name</td>
            </tr>
            <tr>
              <td class="minion-cell">Hit Points</td>
            </tr>
            <tr>
              <td class="minion-cell">Armor Class</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" @click="rollAttacks()">Attack</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" @click="rollDamages()">Damage</td>
            </tr>
            <tr>
              <td class="minion-cell">Attack (Dis)Advantage</td>
            </tr>
            <tr>
              <td class="minion-cell">Weapon</td>
            </tr>
            <!-- <tr>
              <td class="minion-cell">Critical Confirmation</td>
            </tr>
            <tr>
              <td class="minion-cell">Critical Multiplier</td>
            </tr> -->
            <tr>
              <td class="minion-cell">Check (Dis)Advantage</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" @click="rollChecks()">Check Roll</td>
            </tr>
            <tr v-for="(check, cIndex) in (data.showChecks ? data.checks : [])" :key="cIndex" class="check-cell clickable-cell" @click="data.highlightedRow = check.text === data.highlightedRow ? '' : check.text">
              <td class="minion-cell">{{check.text}}</td>
            </tr>
          </table>
        </td>

        <td v-show="shouldShowMinion(minion)" v-for="(minion, mindex) in data.minions" :key="mindex" class="minion-column" v-bind:class="{ 'selected-full-border': minion.highlighted }" v-bind:style="{'min-width': columnWidth, 'max-width': columnWidth}">
          <table v-bind:style="{'width': columnWidth}">
            <tr>
              <td class="minion-cell clickable-cell">{{ (!data.useNicknames || minion.nickname == "") ? minion.name : minion.nickname}}</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" v-bind:class="{ deactivated: (minion.hitPointTotal <= 0) }"><input type="number" min="0" v-model="minion.hitPointTotal"></td>
            </tr>
            <tr>
              <td class="minion-cell">{{minion.armorClass}}</td>
            </tr>
            <tr>
              <td class="minion-cell" v-bind:style="{'background-color': getAttackColor(minion)}">{{getAttackTotal(minion)}}</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" v-bind:class="{ active: (minion.addToDamageTotal && getAttackTotal(minion) >= data.targetAC), deactivated: (minion.addToDamageTotal && getAttackTotal(minion) < data.targetAC) }" @click="minion.addToDamageTotal = !minion.addToDamageTotal">{{getDamageTotal(minion)}}</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell" v-bind:style="{'background-color': minion.attackRollMode.color}" @click="toggleAttackRollMode(minion)">{{data.useNicknames ? minion.attackRollMode.abbreviation : minion.attackRollMode.type}}</td>
            </tr>
            <tr>
              <td class="minion-cell clickable-cell">
                <select v-model="minion.selectedWeapon" @change="minionUpdated(minion)">
                  <option v-for="(weapon, windex) in minion.weapons" :key="windex" v-bind:value="weapon" style="text-align: center;">{{data.useNicknames ? weapon.nickname : weapon.name}}</option>
                </select>
              </td>
            </tr>
            <!-- <tr>
              <td class="minion-cell">{{!isAttackCritical(minion) ? '-' : minion.criticalConfirmationRoll}}</td>
            </tr>
            <tr>
              <td class="minion-cell">{{!isAttackCritical(minion) ? '-' : minion.criticalMultiplierRoll}}</td>
            </tr> -->
            <tr>
              <td class="minion-cell clickable-cell" v-bind:style="{'background-color': minion.checkRollMode.color}" @click="toggleCheckRollMode(minion)">{{data.useNicknames ? minion.checkRollMode.abbreviation : minion.checkRollMode.type}}</td>
            </tr>
            <tr>
              <td class="minion-cell">{{getCheckRoll(minion)}}</td>
            </tr>
            <tr v-for="(check, cIndex) in data.showChecks ? data.checks : []" :key="cIndex" v-bind:class="{ 'check-fail': getCheckTotal(minion, check) < data.checkDC, 'check-pass': getCheckTotal(minion, check) >= data.checkDC, 'selected-row-border': (data.highlightedRow == check.text && !minion.highlighted), 'double-selected-row-border': (data.highlightedRow == check.text && minion.highlighted) }">
              <td class="minion-cell">{{getCheckTotal(minion, check)}}</td>
            </tr>
          </table>
        </td>

        <td>
          <table>
            <tr>
              <td class="minion-cell">Totals</td>
            </tr>
            <tr>
              <td class="minion-cell">-</td>
            </tr>
            <tr>
              <td class="minion-cell">-</td>
            </tr>
            <tr>
              <td class="minion-cell">-</td>
            </tr>
            <tr>
              <td class="minion-cell">{{damageTotal}}</td>
            </tr>
            <tr v-for="i in ((data.showChecks ? data.checks.length : 0) + 4)" :key="i">
              <td class="minion-cell">-</td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

    <div v-if="data.mode == 'edit'" style="text-align: left;">

      <table>
        <tr>
          <td>
            <table>
              <tr>
                <td class="minion-cell">Name</td>
              </tr>
              <tr>
                <td class="minion-cell">Nickname</td>
              </tr>
              <tr>
                <td class="minion-cell" style="min-width: 100px;">Hit Points</td>
              </tr>
              <tr>
                <td class="minion-cell" style="min-width: 100px;">Armor Class</td>
              </tr>
              <tr>
                <td class="minion-cell" style="min-width: 150px;">Selected Weapon</td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="min-width: 150px;" @click="shiftLeft(data.minions)">Shift Left</td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="min-width: 150px;" @click="shiftRight(data.minions)">Shift Right</td>
              </tr>
              <tr>
                <td class="minion-cell" style="min-width: 150px;">Clone Minion</td>
              </tr>
              <tr>
                <td class="minion-cell" style="min-width: 150px;">Delete Minion</td>
              </tr>
            </table>
          </td>

          <td v-for="(minion, mindex) in data.minions" :key="mindex" class="minion-column">
            <table v-bind:style="{'width': columnWidth}">
              <tr>
                <td class="minion-cell clickable-cell"><input type="text" v-model="minion.name"></td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell"><input type="text" v-model="minion.nickname"></td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" v-bind:class="{ deactivated: (minion.hitPointTotal <= 0) }"><input type="number" min="0" v-model="minion.hitPointTotal"></td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell"><input type="number" min="0" v-model="minion.armorClass"></td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell">
                  <select v-model="minion.selectedWeapon" @change="minionUpdated(minion)">
                    <option v-for="(weapon, windex) in minion.weapons" :key="windex" v-bind:value="weapon" style="text-align: center;">{{weapon.name}}</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="text-align: center;" @click="swapLeft(data.minions, minion)">&lt;&lt;</td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="text-align: center;" @click="swapRight(data.minions, minion)">&gt;&gt;</td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="text-align: center;" @click="cloneMinion(minion)">Clone</td>
              </tr>
              <tr>
                <td class="minion-cell clickable-cell" style="text-align: center;" v-bind:class="{unclickable: data.minions.length <= 1}" @click="deleteMinion(minion)">Delete</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <br/>
      <br/>
      <div style="font-weight: bold;">Minion Editor</div>
      <br/>

      <table>
        <tr>
          <td style="padding-right: 5px;">Selected Minion</td>
          <td class="clickable-cell">
            <select v-model="data.tmp.minion" @change="minionUpdated(data.tmp.minion)" style="min-width: 150px;">
              <option v-for="(minion, mindex) in data.minions" :key="mindex" v-bind:value="minion" style="text-align: center;">{{minion.name}}</option>
            </select>
          </td>
        </tr>
      </table>

      <br/>
      <table>
        <tr>
          <td style="padding-right: 5px;">Selected Weapon</td>
          <td class="clickable-cell">
            <select v-model="data.tmp.selectedWeapon" @change="minionUpdated(data.tmp.minion)">
              <option v-for="(weapon, windex) in data.tmp.minion.weapons" :key="windex" v-bind:value="weapon" style="text-align: center;">{{weapon.name}}</option>
            </select>
          </td>
          <td class="clickable-cell" style="padding-right: 5px; padding-left: 5px;" @click="cloneSelectedWeapon">Clone Weapon</td>
          <td class="clickable-cell" style="padding-right: 5px; padding-left: 5px;" v-bind:class="{unclickable: data.tmp.minion.weapons.length <= 1}" @click="deleteSelectedWeapon">Delete Weapon</td>
        </tr>
        <tr>
          <td style="padding-right: 5px;">Weapon Name</td>
          <td><input type="text" v-model="data.tmp.selectedWeapon.name"></td>
        </tr>
        <tr>
          <td style="padding-right: 5px;">Weapon Nickname</td>
          <td><input type="text" v-model="data.tmp.selectedWeapon.nickname"></td>
        </tr>
        <tr>
          <td style="padding-right: 5px;">Attack Modifier</td>
          <td><input type="number" v-model="data.tmp.selectedWeapon.attackMod"></td>
        </tr>
        <tr>
          <td style="padding-right: 5px;">Damage Modifier</td>
          <td><input type="number" v-model="data.tmp.selectedWeapon.damageMod"></td>
        </tr>
      </table>

      <br/>
      <div>Damage Dice</div>
      <table style="max-width: 300px; border: 1px solid black;">
        <tr style="max-width: 300px; border: 1px solid black;">
          <th>d4</th>
          <th>d6</th>
          <th>d8</th>
          <th>d10</th>
          <th>d12</th>
        </tr>
        <tr style="max-width: 300px; border: 1px solid black;">
          <td><input type="number" min="0" v-model="data.tmp.weaponD4" @change="editorWeaponUpdated"></td>
          <td><input type="number" min="0" v-model="data.tmp.weaponD6" @change="editorWeaponUpdated"></td>
          <td><input type="number" min="0" v-model="data.tmp.weaponD8" @change="editorWeaponUpdated"></td>
          <td><input type="number" min="0" v-model="data.tmp.weaponD10" @change="editorWeaponUpdated"></td>
          <td><input type="number" min="0" v-model="data.tmp.weaponD12" @change="editorWeaponUpdated"></td>
        </tr>
      </table>

      <br/>
      <div>Modifiers</div>
      <table style="max-width: 600px; border: 1px solid black;">
        <tr style="max-width: 600px; border: 1px solid black;">
          <th>Strength</th>
          <th>Dexterity</th>
          <th>Constitution</th>
          <th>Intelligence</th>
          <th>Wisdom</th>
          <th>Charisma</th>
          <th>Proficiency</th>
        </tr>
        <tr style="max-width: 600px; border: 1px solid black;">
          <td><input type="number" v-model="data.tmp.minion.strMod"></td>
          <td><input type="number" v-model="data.tmp.minion.dexMod"></td>
          <td><input type="number" v-model="data.tmp.minion.conMod"></td>
          <td><input type="number" v-model="data.tmp.minion.intMod"></td>
          <td><input type="number" v-model="data.tmp.minion.wisMod"></td>
          <td><input type="number" v-model="data.tmp.minion.chaMod"></td>
          <td><input type="number" v-model="data.tmp.minion.proficiencyMod"></td>
        </tr>
      </table>
      <br/>

      <div>Checks and Saves</div>
      <table style="max-width: 1000px; border: 1px solid black;">
        <tr style="max-width: 1000px; border: 1px solid black;">
          <th style="padding-left: 4px; padding-right: 4px; border: 1px solid black;"></th>
          <th style="padding-left: 4px; padding-right: 4px; border: 1px solid black;">Has Proficiency</th>
          <th style="padding-left: 4px; padding-right: 4px; border: 1px solid black;">Enable Override</th>
          <th style="padding-left: 4px; border: 1px solid black; max-width: 150px;">Override Value</th>
        </tr>
        <tr v-for="(check, index) in data.checks" :key="index" style="max-width: 1000px; border: 1px solid black;">
          <td>{{check.text}}</td>
          <td class="clickable-cell" v-bind:class="{active: (data.tmp.minion.checks[check.text].hasProficiency && !data.tmp.minion.checks[check.text].shouldOverride), deactivated: (data.tmp.minion.checks[check.text].hasProficiency && data.tmp.minion.checks[check.text].shouldOverride)}" @click="data.tmp.minion.checks[check.text].hasProficiency = !data.tmp.minion.checks[check.text].hasProficiency" style="text-align: center;">{{data.tmp.minion.checks[check.text].hasProficiency ? 'yes' : 'no'}}</td>
          <td class="clickable-cell" v-bind:class="{active: data.tmp.minion.checks[check.text].shouldOverride}" @click="data.tmp.minion.checks[check.text].shouldOverride = !data.tmp.minion.checks[check.text].shouldOverride" style="text-align: center;">{{data.tmp.minion.checks[check.text].shouldOverride ? 'yes' : 'no'}}</td>
          <td v-bind:class="{active: data.tmp.minion.checks[check.text].shouldOverride}"><input type="number" v-model="data.tmp.minion.checks[check.text].overrideValue" style="max-width: 150px;"></td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
import LZString from 'lz-string';

export default {
  name: 'MinionManager',
  data () {
    return {
      data: {
        mode: 'normal',
        colWidth: 60,
        hideDead: false,
        useNicknames: true,
        checkDC: 10,
        targetAC: 14,
        highlightedRow: '',
        selectedDamage: 0,
        showChecks: true,
        shouldApplyDamageConditionally: false,
        damageCondition: 'On Failed Save/Check',
        noDamageOnConditionFail: false,
        minions: [],
        rerollModes: [
          {type: 'normal', abbreviation: 'nml', color: '#ffffff'},
          {type: 'advantage', abbreviation: 'adv', color: '#aaffaa'},
          {type: 'disadvantage', abbreviation: 'dis', color: '#ffaaaa'}
        ],
        tmp: {minion: null, weaponD4: 0, weaponD6: 0, weaponD8: 0, weaponD10: 0, weaponD12: 0, selectedWeapon: null},
        checks: [
          {text: 'Strength Save', type: "str"},
          {text: 'Dexterity Save', type: "dex"},
          {text: 'Constitution Save', type: "con"},
          {text: 'Intelligence Save', type: "int"},
          {text: 'Wisdom Save', type: "wis"},
          {text: 'Charisma Save', type: "cha"},
          {text: 'Strength Check', type: "str"},
          {text: 'Dexterity Check', type: "dex"},
          {text: 'Constitution Check', type: "con"},
          {text: 'Intelligence Check', type: "int"},
          {text: 'Wisdom Check', type: "wis"},
          {text: 'Charisma Check', type: "cha"},
          {text: 'Acrobatics Check', type: "dex"},
          {text: 'Animal Handling Check', type: "wis"},
          {text: 'Arcana Check', type: "int"},
          {text: 'Athletics Check', type: "str"},
          {text: 'Deception Check', type: "cha"},
          {text: 'History Check', type: "int"},
          {text: 'Insight Check', type: "wis"},
          {text: 'Intimidation Check', type: "cha"},
          {text: 'Investigation Check', type: "int"},
          {text: 'Medicine Check', type: "wis"},
          {text: 'Nature Check', type: "int"},
          {text: 'Perception Check', type: "wis"},
          {text: 'Performance Check', type: "cha"},
          {text: 'Persuasion Check', type: "cha"},
          {text: 'Religion Check', type: "int"},
          {text: 'Sleight of Hand Check', type: "dex"},
          {text: 'Stealth Check', type: "dex"},
          {text: 'Survival Check', type: "wis"}
        ]
      },
      dataBase64: ''
    };
  },
  mounted () {
    for (let i = 0; i < 12; i++) {
      this.data.minions.push(this.buildDefaultMinion());
      this.data.minions[i].name += ' ' + (i + 1);
      this.data.minions[i].nickname += ' ' + (i + 1);
    }
    this.data.tmp.minion = this.data.minions[0];
    this.data.tmp.selectedWeapon = this.data.tmp.minion.weapons[0];
    this.updateWeaponEditorDice(this.data.tmp.minion);
  },
  computed: {
    damageTotal: function () {
      let total = 0;
      this.data.minions.forEach((minion) => {
        if (minion.addToDamageTotal && !this.isMinionDead(minion) && !this.isAttackCriticalFailure(minion) && this.getAttackTotal(minion) >= this.data.targetAC) {
          total += this.getDamageTotal(minion);
        }
      });
      return total;
    },
    columnWidth: function () {
      return (this.data.colWidth <= 30 ? '30' : this.data.colWidth) + 'px';
    }
  },
  methods: {
    encodeData() {
      this.dataBase64 = LZString.compressToBase64(JSON.stringify(this.data));
    },
    decodeData() {
      this.data = JSON.parse(LZString.decompressFromBase64(this.dataBase64));
    },
    buildDefaultMinion() {
      let minion = {};
      minion.name = 'Skeleton';
      minion.nickname = 'sktn';
      minion.hitPointTotal = 10;
      minion.armorClass = 13;
      minion.highlighted = false;
      
      minion.proficiencyMod = 0; //modifier is half the challenge rating
      minion.strMod = 0;
      minion.dexMod = 2;
      minion.conMod = 2;
      minion.intMod = -2;
      minion.wisMod = -1;
      minion.chaMod = -3;
      minion.checks = {
        'Strength Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Dexterity Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Constitution Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Intelligence Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Wisdom Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Charisma Save': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Strength Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Dexterity Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Constitution Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Intelligence Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Wisdom Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Charisma Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Acrobatics Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Animal Handling Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Arcana Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Athletics Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Deception Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'History Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Insight Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Intimidation Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Investigation Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Medicine Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Nature Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Perception Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Performance Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Persuasion Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Religion Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Sleight of Hand Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Stealth Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0},
        'Survival Check': {hasProficiency: false, shouldOverride: false, overrideValue: 0}
      };



      minion.attackRollMode = this.data.rerollModes.find(type => type.type === "normal");
      minion.checkRollMode = this.data.rerollModes.find(type => type.type === "normal");
      minion.weapons = [
        {name: "short bow", nickname: "sBow", attackMod: 0, damageDice: [6], damageMod: 0},
        {name: "short sword", nickname: "sSrd", attackMod: 0, damageDice: [6], damageMod: 0}];
      minion.selectedWeapon = minion.weapons[0];
      minion.attackDie = 20;
      minion.criticalMultiplierDie = 4;
      minion.criticalConfirmationRoll = 0;
      minion.criticalMultiplierRoll = 1;
      minion.criticalSuccessThreshold = 20;
      minion.criticalFailureThreshold = 1;
      minion.attackRolls = [];
      minion.damageRolls = [];
      minion.checkRolls = [];

      this.rollAttack(minion);
      this.rollDamage(minion);
      this.rollCheck(minion);

      minion.addToDamageTotal = true;

      return minion;
    },
    rollDie(die) {
      return Math.ceil(Math.random() * die);
    },
    rollAttacks() {
      this.data.minions.forEach( (minion) => {
        this.rollAttack(minion);
      });
    },
    rollDamages() {
      this.data.minions.forEach( (minion) => {
        this.rollDamage(minion);
      });
    },
    rollChecks() {
      this.data.minions.forEach( (minion) => {
        this.rollCheck(minion);
      });
    },
    reroll() {
      this.rollAttacks();
      this.rollDamages();
      this.rollChecks();
    },
    rollAttack(minion) {
      minion.attackRolls = [];
      minion.attackRolls.push(this.rollDie(minion.attackDie));
      minion.attackRolls.push(this.rollDie(minion.attackDie));
      minion.criticalConfirmationRoll = this.rollDie(minion.attackDie);
      minion.criticalMultiplierRoll = this.rollDie(minion.criticalMultiplierDie);
    },
    rollDamage(minion) {
      minion.damageRolls = [];
      minion.selectedWeapon.damageDice.forEach(die => minion.damageRolls.push(this.rollDie(die)));
    },
    rollCheck(minion) {
      minion.checkRolls = [];
      minion.checkRolls.push(this.rollDie(20));
      minion.checkRolls.push(this.rollDie(20));
    },
    getAttackRoll(minion) {
      switch(minion.attackRollMode.type) {
        case 'normal':
          return minion.attackRolls[0];
        case 'advantage':
          return Math.max.apply(null,minion.attackRolls);
        case 'disadvantage':
          return Math.min.apply(null,minion.attackRolls);
      }
    },
    getCheckRoll(minion) {
      switch(minion.checkRollMode.type) {
        case 'normal':
          return minion.checkRolls[0];
        case 'advantage':
          return Math.max.apply(null,minion.checkRolls);
        case 'disadvantage':
          return Math.min.apply(null,minion.checkRolls);
      }
    },
    getAttackTotal(minion) {
      return this.getAttackRoll(minion) + parseInt(minion.selectedWeapon.attackMod);
    },
    getDamageTotal(minion) {
      let diceTotal = minion.damageRolls.reduce( (accum, prev) => accum + prev );
      let damage = 0;
      if (this.isAttackCriticalSuccess(minion)) {
        damage = diceTotal * 2;
      } else {
        damage = diceTotal;
      }
      damage += parseInt(minion.selectedWeapon.damageMod,10);
      return damage;
    },
    getCheckTotal(minion, check) {
      let checkRoll = this.getCheckRoll(minion);
      return minion.checks[check.text].shouldOverride ? (checkRoll + parseInt(minion.checks[check.text].overrideValue)) : ( checkRoll + this.getSkillByType(minion, check.type) + (minion.checks[check.text].hasProficiency ? parseInt(minion.proficiencyMod) : 0));
    },
    isAttackCriticalSuccess(minion) {
      return this.getAttackRoll(minion) >= minion.criticalSuccessThreshold;
    },
    isAttackCriticalFailure(minion) {
      return this.getAttackRoll(minion) <= minion.criticalFailureThreshold;
    },
    isAttackCritical(minion) {
      return this.isAttackCriticalSuccess(minion) || this.isAttackCriticalFailure(minion);
    },
    getAttackColor(minion) {
      if (this.isAttackCriticalSuccess(minion)) {
        return '#aaffaa';
      } else if (this.isAttackCriticalFailure(minion)) {
        return '#ffaaaa';
      } else {
        return '#ffffff';
      }
    },
    toggleAttackRollMode(minion) {
      //Get the next attackRollMode
      minion.attackRollMode = this.data.rerollModes[(this.data.rerollModes.indexOf(minion.attackRollMode) + 1) % this.data.rerollModes.length];
    },
    toggleCheckRollMode(minion) {
      //Get the next checkRollMode
      minion.checkRollMode = this.data.rerollModes[(this.data.rerollModes.indexOf(minion.checkRollMode) + 1) % this.data.rerollModes.length];
    },
    isMinionDead(minion) {
      return isNaN(minion.hitPointTotal) || minion.hitPointTotal <= 0;
    },
    minionUpdated(minion) {
      this.rollAttack(minion);
      this.rollDamage(minion);
      this.rollCheck(minion);
      this.updateWeaponEditorDice(minion);
    },
    toggleMode() {
      switch(this.data.mode) {
        case 'normal':
          this.data.mode = 'edit';
          break;
        case 'edit':
          this.data.mode = 'normal';
          break;
      }
    },
    countNumDiceByType(dice) {
      let diceBins = {};
      dice.forEach(die => {
        if (diceBins[die] == undefined){
          diceBins[die] = 1;
        } else {
          diceBins[die] += 1;
        }
      });
      return diceBins;
    },
    updateWeaponEditorDice(minion) {
      if (this.data.tmp.minion == minion) {
        let separatedDamageDice = this.countNumDiceByType(this.data.tmp.selectedWeapon.damageDice);
        this.data.tmp.weaponD4 = separatedDamageDice["4"] == undefined ? 0 : separatedDamageDice["4"];
        this.data.tmp.weaponD6 = separatedDamageDice["6"] == undefined ? 0 : separatedDamageDice["6"];
        this.data.tmp.weaponD8 = separatedDamageDice["8"] == undefined ? 0 : separatedDamageDice["8"];
        this.data.tmp.weaponD10 = separatedDamageDice["10"] == undefined ? 0 : separatedDamageDice["10"];
        this.data.tmp.weaponD12 = separatedDamageDice["12"] == undefined ? 0 : separatedDamageDice["12"];
      }
    },
    editorWeaponUpdated() {
      let damageDice = this.data.tmp.selectedWeapon.damageDice;
      damageDice.length = 0;
      this.pushNumberToArray(damageDice, 4, isNaN(this.data.tmp.weaponD4) ? 0 : this.data.tmp.weaponD4);
      this.pushNumberToArray(damageDice, 6, isNaN(this.data.tmp.weaponD6) ? 0 : this.data.tmp.weaponD6);
      this.pushNumberToArray(damageDice, 8, isNaN(this.data.tmp.weaponD8) ? 0 : this.data.tmp.weaponD8);
      this.pushNumberToArray(damageDice, 10, isNaN(this.data.tmp.weaponD10) ? 0 : this.data.tmp.weaponD10);
      this.pushNumberToArray(damageDice, 12, isNaN(this.data.tmp.weaponD12)? 0 : this.data.tmp.weaponD12);
      this.minionUpdated(this.data.tmp.minion);
    },
    pushNumberToArray(array, number, numTimesToPush) {
      for (let i = 0; i < numTimesToPush; i++) {
        array.push(number);
      }
    },
    swap(array, index1, index2) {
      let tmp = array[index2];
      array[index2] = array[index1];
      array[index1] = tmp;
      //Force vue to update
      array.push({});
      array.pop();
    },
    swapLeft(array, element) {
      let index = array.indexOf(element);
      let swapIndex = (index == 0 ? array.length : index) - 1;
      this.swap(array, index, swapIndex);
    },
    swapRight(array, element) {
      let index = array.indexOf(element);
      let swapIndex = index == (array.length - 1) ? 0 : index + 1;
      this.swap(array, index, swapIndex);
    },
    shiftLeft(array) {
      let tmp = array[0];
      array.shift();
      array.push(tmp);
    },
    shiftRight(array) {
      let tmp = array[array.length - 1];
      array.pop();
      array.unshift(tmp);
      
    },
    removeElement(array, element) {
      let index = array.indexOf(element);
      array.splice(index, 1);
      //Force vue to update
      array.push({});
      array.pop();
    },
    cloneElement(array, element) {
      let copy = JSON.parse(JSON.stringify( element ));
      array.push(copy);
    },
    getSkillByType(minion, type) {
      switch(type) {
        case 'str':
          return parseInt(minion.strMod);
        case 'dex':
          return parseInt(minion.dexMod);
        case 'con':
          return parseInt(minion.conMod);
        case 'int':
          return parseInt(minion.intMod);
        case 'wis':
          return parseInt(minion.wisMod);
        case 'cha':
          return parseInt(minion.chaMod);
      }
    },
    applyDamageToSelectedMinions(damage, shouldApplyDamageConditionally, damageCondition, noDamageOnConditionFail) {
      this.data.minions.forEach(minion => {
        if (minion.highlighted) {
          if (shouldApplyDamageConditionally) {
            if (this.canMinionMeetConditon(minion, damageCondition)) {
                if (this.doesMinionMeetCondition(minion, damageCondition)) {
                minion.hitPointTotal = Math.max(0, minion.hitPointTotal - damage);
              } else {
                if (!noDamageOnConditionFail) {
                  minion.hitPointTotal = Math.max(0, minion.hitPointTotal - (Math.floor(damage/2)));
                }
              }
            }
          } else {
            minion.hitPointTotal = Math.max(0, minion.hitPointTotal - damage);
          }
          
          if (minion.hitPointTotal <= 0 && this.data.hideDead) {
            minion.highlighted = false;
          }
        }
      });
    },
    canMinionMeetConditon(minion, damageCondition) {
      switch(damageCondition) {
        case 'On Failed Save/Check':
        case 'On Successful Save/Check':
          return this.data.highlightedRow != undefined && this.data.highlightedRow !== '';
        default:
          return true;
      }
    },
    doesMinionMeetCondition(minion, damageCondition) {
      switch(damageCondition) {
        case 'On Hit':
          return this.getAttackTotal(minion) >= this.data.targetAC;
        case 'On Miss':
          return this.getAttackTotal(minion) < this.data.targetAC;
        case 'On Failed Save/Check':
          return this.getCheckTotal(minion, this.data.checks.find((check) => check.text === this.data.highlightedRow)) < this.data.checkDC;
        case 'On Successful Save/Check':
          return this.getCheckTotal(minion, this.data.checks.find((check) => check.text === this.data.highlightedRow)) >= this.data.checkDC;
      }
    },
    shouldShowMinion(minion) {
      return this.data.hideDead ? (minion.hitPointTotal === '' || minion.hitPointTotal > 0) : true;
    },
    getNumMinionColumns() {
      let count = 0;
      return this.data.minions.filter(this.shouldShowMinion).length;
    },
    cloneMinion(minion) {
      this.cloneElement(this.data.minions, minion);
    },
    deleteMinion(minion) {
      if (this.data.minions.length > 1) {
        this.removeElement(this.data.minions, minion);
        if (minion == this.data.tmp.minion) {
          this.data.tmp.minion = this.data.minions[0];
        }
      }
    },
    cloneSelectedWeapon() {
      this.cloneElement(this.data.tmp.minion.weapons, this.data.tmp.selectedWeapon);
      this.data.tmp.selectedWeapon = this.data.tmp.minion.weapons[this.data.tmp.minion.weapons.length - 1];
      this.data.tmp.selectedWeapon.name += " copy";
    },
    deleteSelectedWeapon() {
      if (this.data.tmp.minion.weapons.length > 1) {
        this.removeElement(this.data.tmp.minion.weapons, this.data.tmp.selectedWeapon);
        if (this.data.tmp.minion.selectedWeapon == this.data.tmp.selectedWeapon) {
          this.data.tmp.minion.selecteWeapon = this.data.tmp.minion.weapons[0];
        }
        this.data.tmp.selectedWeapon = this.data.tmp.minion.selectedWeapon;
      }
    },
    toggleHideDead() {
      this.data.hideDead = !this.data.hideDead;
      if (this.data.hideDead) {
        this.data.minions.forEach(minion => {
          if (minion.highlighted && minion.hitPointTotal <= 0) {
            minion.highlighted = false;
          }
        });
      }
    },
    toggleConditionalDamage() {
      this.data.shouldApplyDamageConditionally = !this.data.shouldApplyDamageConditionally;
    },
    toggleDamageCondition() {
      switch(this.data.damageCondition) {
        case 'On Hit':
          this.data.damageCondition = 'On Miss';
          break;
        case 'On Miss':
          this.data.damageCondition = 'On Failed Save/Check';
          break;
        case 'On Failed Save/Check':
          this.data.damageCondition = 'On Successful Save/Check';
          break;
        case 'On Successful Save/Check':
          this.data.damageCondition = 'On Hit';
          break;
      }
    },
    toggleDamageExtent() {
      this.data.noDamageOnConditionFail = !this.data.noDamageOnConditionFail;
    }
  }

};
</script>

<style scoped>
  .minion-row {
    padding: 0px;
    margin: 0px;
  }
  .minion-cell {
    border: none;
    width: 0px;
  }
  .clickable-cell {
    user-select: none;
  }
  .clickable-cell:hover {
    cursor: pointer;
    background-color: #dddddd;
  }
  .active {
    background-color: #aaffaa
  }
  .active:hover {
    background-color: #99ee99
  }
  .deactivated {
    background-color: #ffaaaa
  }
  .deactivated:hover {
    background-color: #ff9999
  }
  .unclickable {
    background-color: #bbbbbb;
  }
  .unclickable:hover {
    background-color: #bbbbbb;
    cursor:unset;
  }
  .check-fail {
    background-color: #ffaaaa;
  }
  .check-fail:nth-child(odd) {
    background-color: #ff9999;
  }
  .check-pass {
    background-color: #aaffaa;
  }
  .check-pass:nth-child(odd) {
    background-color: #99ee99;
  }
  .selected-full-border {
    border: 3px solid #cc0000;
  }
  .selected-row-border {
    border-top: 3px solid #cc0000;
    border-bottom: 3px solid #cc0000;
  }
  .double-selected-row-border {
    border-top: 3px solid blue;
    border-bottom: 3px solid blue;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  input[type="number"] {
      -moz-appearance: textfield;
  }
  td input {
    width: 100%;
    box-sizing: border-box;
  }
  td {
    border: 1px solid black;
  }
  th {
    text-align: center;
  }
  input {
    border: none;
    background-color: inherit;
    color: inherit;
    text-align:center;
    font-size: inherit;
  }
  select {
    border: none;
    background-color: inherit;
    color: inherit;
    text-align:center;
    font-size: inherit;
    appearance: none;
    cursor: pointer;
    width: 100%;
  }
  table {
    border-collapse:collapse;
  }
</style>
