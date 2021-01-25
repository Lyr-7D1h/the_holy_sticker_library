import { SocketEvent } from './socket'

export interface TagCreate {
  tag: string
  hash: string
}

export interface Tag extends TagCreate {
  id: number
}

/**
 * Socket
 */

export class GetTagsRequest extends SocketEvent {
  static type = 'library/getTagsRequest'
  constructor() {
    super(GetTagsRequest.type)
  }
}

export class GetTagsResponse extends SocketEvent {
  static type = 'library/getTagsResponse'
  constructor(payload: Tag[]) {
    super(GetTagsResponse.type, payload)
  }
}

export class AddTagRequest extends SocketEvent {
  static type = 'library/addTagRequest'
  payload: TagCreate
  constructor(payload: TagCreate) {
    super(AddTagRequest.type, payload)
  }
}

export class AddTagResponse extends SocketEvent {
  static type = 'library/addTagResponse'
  payload: Tag
  constructor(payload: Tag) {
    super(AddTagResponse.type, payload)
  }
}
