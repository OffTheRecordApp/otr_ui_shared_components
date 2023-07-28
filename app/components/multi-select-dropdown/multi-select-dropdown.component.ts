import angular from 'angular';
import template from './multi-select-dropdown.component.html';
import _ from 'lodash';

type DropdownDataObj = {
  id?: number;
  name?: string;
  value?: string;
  group?: string;
  label?: string;
};

class MultiSelectDropdown {
  options!: DropdownDataObj[];
  selectedOptions!: any[];
  smartButtonText?: string;
  buttonText?: string;
  placeholderText?: string;
  overrideOption?: DropdownDataObj;
  onOptionChanged!: any;
  maxWidth?: string;
  smartTextWidth?: string;

  async $onInit() {
      this.smartButtonText = this.buttonText ?? '';
      this.maxWidth = this.maxWidth ?? '260px';
      this.smartTextWidth = this.smartTextWidth ?? '190px';
  }

  public onOptionSelection(option) {
      const isOptionSelected = _.findIndex(
          this.selectedOptions,
          (o) => o === option
      );

      /* 
      Selecting overrideOption will clear all other selectedOptions

      Selecting any other option will remove overrideOption from the selectedOptions list
      */
     
      if (option.name === this.overrideOption?.name) {
          this.selectedOptions = [];
      } else if (
        this.overrideOption && this.selectedOptions.includes(this.overrideOption) &&
        option !== this.overrideOption
        ) {
          _.remove(this.selectedOptions, (o) => o === this.overrideOption);
      }

      // if findIndex returns -1 option is not in list
      if (isOptionSelected > -1) {
          _.remove(this.selectedOptions, (o) => o === option);
          this.setSmartButtonText(option);
      } else {
          this.selectedOptions.push(option);
          this.setSmartButtonText(option);
      }
      this.onOptionChanged({selectedOptions: this.selectedOptions})
  }

  public setSmartButtonText(option: DropdownDataObj) {
      if (!this.smartButtonText || this.selectedOptions.length === 1) {
          this.smartButtonText = this.selectedOptions[0].label;
      } else if (option.label && this.smartButtonText.includes(option.label)) {
          // matches select options and optionally any comma that follows in the button text
          const regexObj = new RegExp('(, ?' + option.label + ',?)');
          // removes option from selected list button text
          this.smartButtonText = this.smartButtonText.replace(regexObj, '');
      } else {
          this.smartButtonText = `${this.smartButtonText}, ${option.label}`;
      }
  }

  public isOptionSelected(option: DropdownDataObj): boolean {
      const isOptionSelected = _.findIndex(
          this.selectedOptions,
          (o) => o === option
      );

      // if findIndex returns -1 option is not in list
      return isOptionSelected !== -1;
  }
}

const component = {
selector: 'appMultiSelectDropdown',
template: template,
bindings: {
  options: '<',
  selectedOptions: '<',
  buttonText: '@',
  placeholderText: '@',
  overrideOption: '<',
  onOptionChanged: '&',
  maxWidth: '@'
},
controller: MultiSelectDropdown,
controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);

MultiSelectDropdown.$inject = [];