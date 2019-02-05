import { StoreService } from './../store/store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  public empData = [];
  constructor(public store: StoreService) {
    this.empData = this.store.get("photos");
  }

  getAllEmpData() {
    for (let i = 0; i < this.empData.length; i++) {
      if (!this.empData[i].photo) {
        this.empData[i].photo = "/assets/images/default_user.png";
      }
    }
    return this.empData;
  }

  getEmpData(id) {
    let found = false;
    for (let i = 0; i < this.empData.length; i++) {
      if (this.empData[i].id === id) {
        found = true;
        if (!this.empData[i].photo) {
          this.empData[i].photo = "/assets/images/default_user.png";
        }
        return this.empData[i];
      }
    }
    if (!found) {
      return {
        id: id,
        name: "Not Available",
        designation: "Not Available",
        photo: "/assets/images/default_user.png"
      };
    }
  }
}
