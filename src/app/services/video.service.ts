import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { VideoRequest } from '../models/request/video.request';
import { Video } from '../models/video.model';

@Injectable({
    providedIn: 'root'
  })
  export class VideoService {
  
    private URL_API = `${ environment.baseApi }/video`;
  
    constructor(private httpClient: HttpClient) { }
  
    public findAll(): Observable<Video[]>{
      return this.httpClient.get<{ ok: boolean, videos: Video[] }>(
        this.URL_API
      ).pipe(
        map( ({ videos }) => videos )
      );
    }
  
    public save(videoRequest: VideoRequest): Observable<{ ok: boolean, msg: string }>{
      return this.httpClient.post<{ ok: boolean, msg: string }>(
        this.URL_API, videoRequest
      ).pipe(
        catchError( ({ error }) => this.handleError(error) )
      );
    }
  
    public deleteVideo(id: number): Observable<{ ok: boolean, msg: string }>{
      return this.httpClient.delete<{ok: boolean, msg: string}>(
        `${ this.URL_API }/${ id }`
      );
    }
  
    private handleError(error): Observable<ErrorType>{
      if (error.errors)
        return throwError({ ok: false, msg: 'Error de request', codeError: -1 });
      else{
        const err = error.msg.originalError.info;
        return throwError({ ok: false, msg: err.message, codeError: err.number });
      }
    }
  }
  
  type ErrorType = { ok: boolean, msg: string, codeError: number };
  