import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of } from 'rxjs';
import {
  BFF_ROUTES_TYPE,
  ExtractPaths,
  IStudentElementModel,
  ResolvePath,
} from '@softbar/api-interfaces';
import { BaseHttpService } from './base-http.service';
import {
  FilterDataResponse,
  LazyLoadEvent,
  TableFiltersServiceService,
} from '@softbar/front/dynamic-table';

@Injectable({
  providedIn: 'root',
})
export abstract class LocalStorageHttpService<
  C extends ExtractPaths<BFF_ROUTES_TYPE> = ExtractPaths<BFF_ROUTES_TYPE>
> implements Omit<BaseHttpService<C>, 'httpClient' | 'getUrl'>
{
  constructor(
    protected tableFiltersServiceService: TableFiltersServiceService
  ) {}
  public controllerPath: C;
  public get apiUrl(): string {
    throw new Error('Method not implemented.');
  }

  private collections: {
    [key in keyof ResolvePath<BFF_ROUTES_TYPE, C>]?: BehaviorSubject<any[]>;
  } = {};

  getCollection<
    T = any,
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string
  >(key: R): BehaviorSubject<T[]> {
    if (!this.collections[key]) {
      const data = this.getDataFromStorage<any>(key);
      this.collections[key] = new BehaviorSubject<any[]>(data);
    }
    return this.collections[key];
  }

  getCollectionLazyLoad<
    T = any,
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string
  >(key: R, evt: LazyLoadEvent<T>): Observable<FilterDataResponse<any>> {
    if (!this.collections[key]) {
      const data = this.getDataFromStorage<T>(key);
      this.collections[key] = new BehaviorSubject<T[]>(data);
    }
    return this.collections[key]?.pipe(
      map((i) => {
        return this.tableFiltersServiceService.filter(i, evt);
      }),
      delay(1000)
    );
  }

  protected getDataFromStorage<
    T = any,
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string
  >(key: R): T[] {
    const storedData = localStorage.getItem(`${this.controllerPath}/${key}`);
    return storedData ? JSON.parse(storedData) : [];
  }

  protected saveDataToStorage<
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string
  >(key: R, data: any[]): void {
    localStorage.setItem(`${this.controllerPath}/${key}`, JSON.stringify(data));
    this.collections[key]?.next(data);
  }

  get<
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string,
    U extends {
      [K in R]: 'get' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R] = {
      [K in R]: 'get' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R],
    T extends ResolvePath<BFF_ROUTES_TYPE, C>[U]['response'] = ResolvePath<
      BFF_ROUTES_TYPE,
      C
    >[U]['response']
  >(key: R, { params }: { params: { id: number } }): Observable<T> {
    return this.getCollection(key)
      .asObservable()
      ?.pipe(
        map((l) =>
          l?.find((i) => (i as IStudentElementModel)?.id === Number(params.id))
        )
      );
  }

  post<
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string,
    U extends {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R] = {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R],
    T extends ResolvePath<BFF_ROUTES_TYPE, C>[U]['response'] = ResolvePath<
      BFF_ROUTES_TYPE,
      C
    >[U]['response']
  >(key: R, item: T): Observable<T> {
    const collection = this.getDataFromStorage(key);
    const maxId =
      collection.length > 0
        ? Math.max(...collection.map((obj) => obj.id || 0))
        : 0;
    item.id = maxId + 1;
    collection.push(item);
    this.saveDataToStorage(key, collection);
    return of(item);
  }

  put<
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string,
    U extends {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R] = {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R],
    T extends ResolvePath<BFF_ROUTES_TYPE, C>[U]['response'] = ResolvePath<
      BFF_ROUTES_TYPE,
      C
    >[U]['response']
  >(key: R, updatedItem: T): Observable<T> {
    const collection = this.getDataFromStorage(key).map((item) =>
      (item as IStudentElementModel).id ===
      (updatedItem as IStudentElementModel).id
        ? updatedItem
        : item
    );
    this.saveDataToStorage(key, collection);
    return of(updatedItem);
  }

  delete<
    R extends C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string = C extends ExtractPaths<BFF_ROUTES_TYPE>
      ? keyof ResolvePath<BFF_ROUTES_TYPE, C>
      : string,
    U extends {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R] = {
      [K in R]: 'post' extends ResolvePath<BFF_ROUTES_TYPE, C>[K]['method']
        ? K
        : never;
    }[R],
    T extends ResolvePath<BFF_ROUTES_TYPE, C>[U]['response'] = ResolvePath<
      BFF_ROUTES_TYPE,
      C
    >[U]['response']
  >(key: R, { body }: { body: { id: string | number } }): Observable<T> {
    let deletedItem: T;
    const collection = this.getDataFromStorage(key).filter((item) => {
      if (item.id !== body?.id) {
        return true;
      } else {
        deletedItem = item;
      }
    });
    this.saveDataToStorage(key, collection);
    return of(deletedItem);
  }
}
