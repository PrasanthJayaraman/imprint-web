import { ModalComponent } from "./../helpers/modal/modal.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "./../services/alert.service";
import { Httpservice } from "./../services/httpservice.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { GET_CLIENTS, REFERENCE } from "../../constants";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import * as moment from "moment";
import * as _ from "lodash";
import { StoreService } from "../store/store.service";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"]
})
export class ClientComponent implements OnInit {
  @ViewChild("modal") modal: ModalComponent;
  public clientList: any = [];
  public client: any = {};
  public available = false;
  public modalRef: NgbModalRef;
  public model: any = {};
  public clients = [];
  public employees = {};
  public selectedEmployee: any = {};
  public btn;
  public title;
  public type;
  public reference;

  search = (text: Observable<string>) => {
    console.log(JSON.stringify(text));
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.clients.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }

  constructor(public http: Httpservice, public alert: AlertService, public route: ActivatedRoute, public modalService: NgbModal,
    public store: StoreService) {
    this.employees = this.store.get("photos");
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id: any = params["id"];
      if (!id) {
        this.getClients();
      } else {
        this.openClient({ clientId: id });
      }
    });
  }

  getClients() {
    this.alert.showLoader(true);
    this.http.GET(GET_CLIENTS).subscribe(res => {
      this.alert.showLoader(false);
      this.available = true;
      this.clientList = res;
      this.clients = res ? _.map(res, "name") : [];
      this.store.set("clients", res);
    });
  }

  openClient(item) {
    this.alert.showLoader(true);
    this.client = item;
    this.http.GET(`${GET_CLIENTS}/${item.clientId}`).subscribe(res => {
      this.alert.showLoader(false);
      if (res && res[0]) {
        this.available = true;
        this.client = res[0];
        let tmp = [...this.client.logs, ...this.client.reference];
        tmp = _.sortBy(tmp, "created");
        this.client.logs = tmp.reverse();
      } else {
        // this.alert.showAlert("Client Information is wrong!!!!", "warning");
        this.available = false;
        this.goBack();
      }
    });
  }

  goBack() {
    this.client = {};
    this.getClients();
  }

  newClient(elem, type, model) {
    if (type === "create") {
      this.btn = "Create";
      this.title = "Create Client";
      this.model = {};
      this.type = "create";
    } else {
      this.btn = "Update";
      this.title = "Edit Client";
      this.type = "edit";
      this.model = model;
      const tmp = model.contact.split("+91")[1];
      this.model.number = Number(tmp);
      this.selectedEmployee = model.assignedTo;
    }
    this.modalRef = this.modalService.open(elem, { centered: true, size: "lg" });
    this.modalRef.result.then(
      result => {
        console.log(result);
      },
      reason => {
        console.log(reason);
        this.model = {};
        this.selectedEmployee = {};
        this.type = "";
      }
    );
  }

  selectEmp(item) {
    this.selectedEmployee = item;
  }

  openReference(elem, item) {
    this.modalRef = this.modalService.open(elem, { centered: true, size: "lg" });
    this.modalRef.result.then(
      result => {
        console.log(result);
      },
      reason => {
        console.log(reason);
        this.model = {};
        this.selectedEmployee = {};
        this.type = "";
        this.reference = "";
      }
    );
  }

  addReference(client) {
    if (client && client._id && this.reference) {
      console.log(client, this.reference);
      this.modalRef.close();
      this.alert.showLoader(true);
      this.http.POST(REFERENCE, { id: client._id, reference: this.reference }).subscribe(res => {
        this.alert.showLoader(false);
        this.available = false;
        this.goBack();
      });
    } else if (!this.reference) {
      this.alert.showAlert("Please enter some feedback!", "warning");
    } else {
      this.alert.showAlert("Cannot add Feedback Now! Try again after Refresh!", "danger");
    }
  }

  onSubmit() {
    if (!this.model.address || !this.model.name || !this.model.person) {
      this.alert.showAlert("Fill all the details!", "warning");
      return false;
    } else if (!this.model.number || this.model.number.toString().length !== 10) {
      this.alert.showAlert("Contact Number cannot be empty or less than 10 digits!", "warning");
      return false;
    } else if (!this.selectedEmployee.name) {
      this.alert.showAlert("Please select an employee to assign the client!", "warning");
      return false;
    }
    this.model.contact = "+91" + this.model.number;
    this.model.assignedTo = this.selectedEmployee;
    console.log(this.model);
    if (this.type === "create") {
      this.alert.showLoader(true);
      this.modalRef.close();
      this.http.POST(GET_CLIENTS, this.model).subscribe(res => {
        this.alert.showLoader(false);
        this.available = false;
        this.goBack();
      });
    } else if (this.type === "edit") {
      this.alert.showLoader(true);
      this.modalRef.close();
      this.http.PUT(GET_CLIENTS, this.model).subscribe(res => {
        this.alert.showLoader(false);
        this.available = false;
        this.goBack();
      });
    }
  }
}
