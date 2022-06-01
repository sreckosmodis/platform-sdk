import { Coins, IoC, Services } from "@ardenthq/sdk";
import { BIP44 } from "@ardenthq/sdk-cryptography";
import { deriveKeypair } from "ripple-keypairs";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		return {
			publicKey: child.publicKey.toString("hex"),
			path,
		};
	}

	public override async fromSecret(secret: string): Promise<Services.PublicKeyDataTransferObject> {
		return { publicKey: deriveKeypair(secret).publicKey };
	}
}
