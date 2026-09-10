import { Button, Dropdown } from '@digdir/designsystemet-react';
import classes from './test-form-accordion.module.css';
import { CaretDownFillIcon } from '@navikt/aksel-icons';
import {
  SkjemaMedSvar,
  TestresultatDetaljer,
} from '@test/testregel-form/types';


type Props = {
  index: number;
  items: {
    skjemaMedSvar: SkjemaMedSvar;
    resultatId: number;
    elementOmtale: string | undefined;
    detaljer: TestresultatDetaljer | undefined;
  }[];
  kopierSvar: (kilde: SkjemaMedSvar, index: number) => void;
};

const KopierSvarDropdown = ({
  index,
  items,
  kopierSvar,
}:Props) => {
  return (
    console.log('items', items),
    (
      <>
        <Button
          popovertarget="kopierTestDropdown"
          className={classes.copyButton}
        >
          Kopier svar fra tidligere test
          <CaretDownFillIcon />
        </Button>
        <Dropdown data-size="sm" id={'kopierTestDropdown'}>
          <Dropdown.List>
            {items.map(({ skjemaMedSvar, resultatId, elementOmtale }, i) => {
              if (i === index || !elementOmtale) return null;

              return (
                <Dropdown.Item
                  key={resultatId}
                  onClick={() => kopierSvar(skjemaMedSvar, index)}
                >
                  {elementOmtale}
                </Dropdown.Item>
              );
            })}
          </Dropdown.List>
        </Dropdown>
      </>
    )
  );
};

export default KopierSvarDropdown;
