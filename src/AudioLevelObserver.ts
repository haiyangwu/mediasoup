import Logger from './Logger';
import RtpObserver from './RtpObserver';
import Producer from './Producer';

export interface AudioLevelObserverOptions
{
	/**
	 * Maximum number of entries in the 'volumes”' event. Default 1.
	 */
	maxEntries?: number;

	/**
	 * Minimum average volume (in dBvo from -127 to 0) for entries in the
	 * 'volumes' event.	Default -80.
	 */
	threshold?: number;

	/**
	 * Interval in ms for checking audio volumes. Default 1000.
	 */
	interval?: number;
}

const logger = new Logger('AudioLevelObserver');

export default class AudioLevelObserver extends RtpObserver
{
	/**
	 * @private
	 * @emits {volumes: Array<Object<producer: Producer, volume: Number>>} volumes
	 * @emits silence
	 */
	constructor(params: any)
	{
		super(params);

		this._handleWorkerNotifications();
	}

	private _handleWorkerNotifications(): void
	{
		this._channel.on(this._internal.rtpObserverId, (event: string, data?: any) =>
		{
			switch (event)
			{
				case 'volumes':
				{
					// Get the corresponding Producer instance and remove entries with
					// no Producer (it may have been closed in the meanwhile).
					const volumes = data
						.map(({ producerId, volume }: { producerId: string; volume: number }) => (
							{
								producer : this._getProducerById(producerId),
								volume
							}
						))
						.filter(({ producer }: { producer: Producer }) => producer);

					if (volumes.length > 0)
						this.safeEmit('volumes', volumes);

					break;
				}

				case 'silence':
				{
					this.safeEmit('silence');

					break;
				}

				default:
				{
					logger.error('ignoring unknown event "%s"', event);
				}
			}
		});
	}
}