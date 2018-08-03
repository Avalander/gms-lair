import { union } from '@avalander/fun/src/union'


export const RemoteData = union([
	'NotAsked',
	'Pending',
	'Success',
	'Failure',
])
