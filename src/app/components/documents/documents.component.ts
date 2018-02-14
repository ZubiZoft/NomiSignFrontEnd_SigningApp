import {Component, OnInit, ElementRef} from '@angular/core';
import {DocumentService} from '../../services/documents.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {Document} from '../../models/document.model';
import {Sort} from '@angular/material';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})

export class DocumentsComponent implements OnInit {
  user: User;
  documents: Document[] = [];
  isPromiseDone = false;
  showAll: boolean;
  signedReceiptsBox = false;
  unsignedDocumentsBox = true;
  receiptsBox = false;
  documentsBox = false;
  docsWithSignStatus1Exist = false;
  sortedDocument;

  constructor(private documentService: DocumentService, private userService: UserService, private elementRef: ElementRef) {
  }

  sortDocuments(sort: Sort) {
    const data = this.documents.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedDocument = data;
      return;
    }

    this.sortedDocument = data.sort((a, b) => {
      const isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'SignStatus':
          return this.compare(+a.SignStatus, +b.SignStatus, isAsc);
        case 'PayAmount':
          return this.compare(+a.PayAmount, +b.PayAmount, isAsc);
        case 'DocumentId':
          return this.compare(+a.DocumentId, +b.DocumentId, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  selectedBox1(b) {
    this.unsignedDocumentsBox = b;
    this.signedReceiptsBox = false;
    this.receiptsBox = false;
    this.documentsBox = false;
    this.calculateViewFlag(0);
  }

  selectedBox2(b) {
    this.unsignedDocumentsBox = false;
    this.signedReceiptsBox = b;
    this.receiptsBox = false;
    this.documentsBox = false;
    this.calculateViewFlag(1);
  }

  selectedBox3(b) {
    this.unsignedDocumentsBox = false;
    this.signedReceiptsBox = false;
    this.receiptsBox = b;
    this.documentsBox = false;
    this.calculateViewFlag(2);
  }

  selectedBox4(b) {
    this.unsignedDocumentsBox = false;
    this.signedReceiptsBox = false;
    this.receiptsBox = false;
    this.documentsBox = b;
    this.calculateViewFlag(3);
  }

  calculateViewFlag(item) {
    switch (item) {
      case 0: {
        for (let i of this.documents) {
          if (i.SignStatus == 'Sin Firma') {
            i.ViewFlag = true;
          } else {
            i.ViewFlag = false;
          }
        }
        break;
      }
      case 1: {
        for (let i of this.documents) {
          if (i.SignStatus == 'Firmado' && i.AlwaysShow == 0) {
            i.ViewFlag = true;
          } else {
            i.ViewFlag = false;
          }
        }
        break;
      }
      case 2: {
        for (let i of this.documents) {
          if (i.AlwaysShow == 0) {
            i.ViewFlag = true;
          } else {
            i.ViewFlag = false;
          }
        }
        break;
      }
      case 3: {
        for (let i of this.documents) {
          if (i.AlwaysShow == 1) {
            i.ViewFlag = true;
          } else {
            i.ViewFlag = false;
          }
        }
        break;
      }
    }
  }

  convertToMoney(value, c, d, t) {
    var n = value,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? '.' : d,
      t = t == undefined ? ',' : t,
      s = n < 0 ? '-' : '',
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - Number(i)).toFixed(c).slice(2) : '');
  }


  ngOnInit() {
    this.user = this.userService.getUser();
    this.documentService.getDocumentsForUser(this.user.EmployeeId).subscribe(data => {
      data.forEach(doc => {
        if (doc.SignStatus === 'Sin Firma') {
          this.docsWithSignStatus1Exist = true;
        }
      });
      this.documents = data;
      this.sortedDocument = this.documents.slice();
      this.isPromiseDone = true;
      this.calculateViewFlag(0);
      for (const d of this.documents) {
        d.PayAmountMoney = '';
        d.PayAmountMoney = this.convertToMoney(d.PayAmount, 2, '.', ',');
      }
    });
  }
}
