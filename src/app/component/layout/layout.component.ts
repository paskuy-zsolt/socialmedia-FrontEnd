import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { FeedComponent } from '../feed/feed.component';
import { BubblesService } from '../../service/animation/bubbles/bubbles.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FeedComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {

  private bubblesService = inject(BubblesService)
  private interval: any;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.bubblesService.createCircle();
    }, 50);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}