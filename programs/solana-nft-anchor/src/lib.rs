use anchor_lang::prelude::*;

declare_id!("DLQQhHTBBeY7gGVwXE4vG8vCKCvJKBJZbCcKfbcQSWm9");

#[program]
pub mod solana_nft_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
