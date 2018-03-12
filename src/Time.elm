module Time exposing (Era, Zone(..))


type alias Era =
    { start : Int
    , offset : Int
    , abbr : String
    }


type Zone
    = Zone String (List Era)
